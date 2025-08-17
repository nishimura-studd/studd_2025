# Supabase パフォーマンス最適化案

## 問題の背景

`get_works_with_auth` などSupabaseのRPC関数でレスポンス遅延・タイムアウトが稀に発生する問題について調査を実施。

## 現状の問題点

### 1. クライアント設定の不備
- **ファイル**: `src/lib/supabase.ts:6`
- **問題**: デフォルトの`createClient`でタイムアウト設定なし
- **影響**: ネットワーク遅延時に無制限に待機

### 2. RPC関数の処理負荷
- **ファイル**: `supabase/sql/supabase-auth-functions.sql:117-206`
- **問題**: `get_works_with_auth`で全件スキャン（ORDER BY id DESC）
- **影響**: 82件のワーク全てに認証チェック + マスク処理

### 3. API呼び出しでのタイムアウト制御なし
- **ファイル**: `src/lib/api.ts:102-104`
- **問題**: `supabase.rpc()`にタイムアウト設定なし
- **影響**: 長時間のリクエストがUIを阻害

### 4. 複数の同期的API呼び出し
- **ファイル**: `src/app/works/page.tsx:30`, `src/app/works/[id]/WorkDetailClient.tsx:29`
- **問題**: 認証状態変更時に複数のAPI呼び出しが発生
- **影響**: サーバー負荷増加

## 最適化案

### 1. Supabaseクライアント設定の改善

**実装場所**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  // リアルタイム機能の最適化
  realtime: { 
    params: { eventsPerSecond: 2 }
  },
  // クライアント識別
  global: { 
    headers: { 'x-client-info': 'studd-portfolio' }
  },
  // DB設定
  db: { 
    schema: 'public'
  }
})
```

### 2. タイムアウト付きAPI関数の追加

**実装場所**: `src/lib/api.ts`

```typescript
// タイムアウト付きPromiseラッパー
const withTimeout = <T>(promise: Promise<T>, ms: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  ])
}

// 既存のAPI関数をタイムアウト付きに変更
export async function getAllWorksAPI(): Promise<Work[]> {
  try {
    const token = getStoredToken()
    
    const apiCall = supabase.rpc('get_works_with_auth', {
      auth_token: token
    })
    
    const { data, error } = await withTimeout(apiCall, 8000) // 8秒タイムアウト
    
    if (error) {
      console.error('作品データの取得に失敗しました:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      console.error('API request timed out')
    } else {
      console.error('作品データの取得に失敗しました:', error)
    }
    return []
  }
}
```

### 3. データベースインデックスの追加

**実装場所**: `supabase/sql/performance-indexes.sql`（新規作成）

```sql
-- worksテーブルのパフォーマンス最適化インデックス
CREATE INDEX IF NOT EXISTS idx_works_public_id ON works(is_public, id DESC);
CREATE INDEX IF NOT EXISTS idx_works_id_desc ON works(id DESC);

-- auth_tokensテーブルの期限切れトークン削除最適化
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires ON auth_tokens(expires_at);
```

### 4. RPC関数の最適化

**実装場所**: `supabase/sql/supabase-auth-functions.sql`

既存の`get_works_with_auth`関数にLIMIT対応版を追加:

```sql
-- ページネーション対応版のworks取得関数
CREATE OR REPLACE FUNCTION get_works_with_auth_paginated(
  auth_token TEXT DEFAULT NULL,
  page_limit INTEGER DEFAULT 50,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  terms TEXT,
  skills TEXT[],
  description TEXT,
  is_public BOOLEAN,
  image_count INTEGER,
  project_url TEXT,
  is_masked BOOLEAN,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_authenticated BOOLEAN := FALSE;
  total_works BIGINT;
BEGIN
  -- トークンが提供されている場合は認証チェック
  IF auth_token IS NOT NULL THEN
    is_authenticated := verify_token(auth_token);
  END IF;

  -- 総件数を取得
  SELECT COUNT(*) INTO total_works FROM works;

  RETURN QUERY
  SELECT 
    w.id,
    CASE 
      WHEN w.is_public = FALSE AND NOT is_authenticated THEN mask_title(w.title)
      ELSE w.title
    END as title,
    w.terms,
    w.skills,
    CASE 
      WHEN w.is_public = FALSE AND NOT is_authenticated THEN mask_description(w.description)
      ELSE w.description
    END as description,
    w.is_public,
    w.image_count,
    w.project_url,
    (w.is_public = FALSE AND NOT is_authenticated) as is_masked,
    total_works
  FROM works w
  ORDER BY w.id DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;
```

### 5. クライアントサイドキャッシュの実装

**実装場所**: `src/lib/cache.ts`（新規作成）

```typescript
// シンプルなメモリキャッシュ実装
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>()
  
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  clear(): void {
    this.cache.clear()
  }
}

export const apiCache = new SimpleCache()

// キャッシュ付きAPI関数の例
export async function getCachedWorks(isAuthenticated: boolean): Promise<Work[]> {
  const cacheKey = `works_${isAuthenticated ? 'auth' : 'public'}`
  
  // キャッシュから取得
  const cached = apiCache.get<Work[]>(cacheKey)
  if (cached) {
    return cached
  }
  
  // APIから取得
  const works = isAuthenticated ? await getAllWorksAPI() : await getPublicWorksAPI()
  
  // キャッシュに保存（5分間）
  apiCache.set(cacheKey, works, 5 * 60 * 1000)
  
  return works
}
```

### 6. エラーハンドリングの改善

**実装場所**: `src/lib/api.ts`

```typescript
// リトライ機能付きAPI呼び出し
async function withRetry<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }
  
  throw lastError!
}
```

## 実装優先順位

### Phase 1: 緊急対応（即座に実装可能）
1. **タイムアウト設定の追加** - API関数にタイムアウト制御
2. **エラーハンドリング改善** - ユーザーフィードバック向上

### Phase 2: パフォーマンス改善（1-2週間）
3. **Supabaseクライアント設定最適化**
4. **データベースインデックス追加**
5. **基本的なキャッシュ実装**

### Phase 3: 長期最適化（必要に応じて）
6. **ページネーション対応**
7. **React Query導入検討**
8. **Connection Pooling設定確認**

## 監視・測定

### パフォーマンス指標
- API レスポンス時間（目標: 2秒以下）
- タイムアウト発生率（目標: 1%以下）
- キャッシュヒット率（目標: 70%以上）

### 監視方法
```typescript
// パフォーマンス測定用ユーティリティ
export async function measureApiCall<T>(
  apiCall: () => Promise<T>,
  operationName: string
): Promise<T> {
  const start = performance.now()
  
  try {
    const result = await apiCall()
    const duration = performance.now() - start
    
    console.log(`[PERF] ${operationName}: ${duration.toFixed(2)}ms`)
    
    if (duration > 5000) {
      console.warn(`[PERF] Slow API call detected: ${operationName}`)
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[PERF] Failed API call: ${operationName} (${duration.toFixed(2)}ms)`, error)
    throw error
  }
}
```

## 参考情報

- **Supabase Performance Guide**: https://supabase.com/docs/guides/database/performance
- **PostgreSQL Indexing**: https://www.postgresql.org/docs/current/indexes.html
- **現在の問題箇所**:
  - `src/lib/supabase.ts:6` - クライアント設定
  - `src/lib/api.ts:102-104` - タイムアウト未設定
  - `supabase/sql/supabase-auth-functions.sql:117-206` - RPC関数最適化