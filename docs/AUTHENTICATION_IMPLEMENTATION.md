# 認証機能実装ドキュメント

## 概要
ポートフォリオサイトにパスワード認証機能を実装し、非公開プロジェクトのマスク機能を追加。

## 実装した機能

### 1. 認証システム
- パスワードベースの認証
- JWT風トークンによるセッション管理
- 1時間の有効期限付きトークン

### 2. データマスク機能
- 未認証時：非公開プロジェクトのタイトルと説明文をマスク
- 認証後：全データを表示

### 3. UI/UX
- マスクされたプロジェクトクリック時にPasswordModal表示
- 認証成功時に自動的にデータ更新
- 認証失敗時のエラーメッセージ表示

## ファイル構成

### フロントエンド
```
src/
├── contexts/
│   └── AuthContext.tsx          # 認証状態管理
├── app/
│   ├── components/
│   │   ├── PasswordModal.tsx    # パスワード入力モーダル
│   │   └── WorkItem.tsx         # プロジェクトアイテム（マスク表示対応）
│   ├── work/
│   │   ├── page.tsx             # プロジェクト一覧（認証対応）
│   │   └── [id]/page.tsx        # プロジェクト詳細（認証対応）
│   └── layout.tsx               # AuthProvider設定
└── lib/
    ├── api.ts                   # API関数（認証・データ取得）
    └── supabase.ts             # Supabase設定・型定義
```

### バックエンド（Supabase）
```
data/
└── supabase-auth-functions.sql # 認証関数・RLS設定
```

## 主要な実装内容

### 1. Supabase認証関数

#### パスワード認証関数
```sql
CREATE OR REPLACE FUNCTION authenticate_admin(input_password TEXT)
RETURNS TABLE(success BOOLEAN, token TEXT, expires_at TIMESTAMPTZ)
```
- bcryptでパスワードハッシュ検証
- 認証成功時にランダムトークン生成
- 1時間の有効期限設定

#### データ取得関数（マスク機能付き）
```sql
CREATE OR REPLACE FUNCTION get_works_with_auth(auth_token TEXT DEFAULT NULL)
CREATE OR REPLACE FUNCTION get_work_by_id_with_auth(work_id UUID, auth_token TEXT DEFAULT NULL)
```
- トークン検証による認証チェック
- 未認証時：タイトル・説明文をマスク
- 認証済み：全データを返却

#### マスク関数
```sql
CREATE OR REPLACE FUNCTION mask_title(title TEXT) -- "**********"
CREATE OR REPLACE FUNCTION mask_description(description TEXT) -- "この内容を閲覧するにはパスワードが必要です。"
```

### 2. 認証コンテキスト

```typescript
// AuthContext.tsx
interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshData: () => void
}
```

### 3. API関数

#### 認証関連
```typescript
// api.ts
export async function authenticateAdmin(password: string): Promise<boolean>
export async function logout(): Promise<void>
export function isAuthenticated(): boolean
```

#### データ取得関連
```typescript
// パスワードなし（マスクされたデータ）
export async function getPublicWorksAPI(): Promise<Work[]>
export async function getPublicWorkByIdAPI(id: string): Promise<Work | null>

// パスワードあり（全データ）
export async function getAllWorksAPI(): Promise<Work[]>
export async function getWorkByIdAPI(id: string): Promise<Work | null>
```

### 4. UI コンポーネント

#### PasswordModal
- パスワード入力フォーム
- 認証状態管理
- エラーメッセージ表示

#### WorkItem
- マスクされたプロジェクトの "Limited" バッジ表示
- クリック時のモーダル表示処理

## データフロー

### 1. 初期状態（未認証）
```
Page Load → getPublicWorksAPI() → マスクされたデータ表示
```

### 2. 認証フロー
```
マスクプロジェクトクリック → PasswordModal表示 → パスワード入力
→ authenticateAdmin() → トークン取得・保存 → getAllWorksAPI()
→ 全データ表示
```

### 3. 認証済み状態
```
Page Load → isAuthenticated=true → getAllWorksAPI() → 全データ表示
```

## セキュリティ考慮事項

### 1. パスワード管理
- bcryptによるハッシュ化
- データベースに平文保存なし

### 2. トークン管理
- ランダム生成（32バイト）
- 1時間の有効期限
- ローカルストレージに保存

### 3. RLS（Row Level Security）
```sql
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
```

### 4. 関数セキュリティ
```sql
SECURITY DEFINER -- 関数実行者の権限で実行
```

## 環境変数

### 開発環境
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 本番環境
- `NEXT_PUBLIC_*` は公開されても安全（RLSで保護）
- 静的ビルド時に環境変数が埋め込まれる

## デプロイ手順

### 1. 静的ビルド
```bash
npm run build
```

### 2. アップロード
```bash
# out/ フォルダの中身をレンタルサーバーにアップロード
```

## 設定済みパスワード
パスワード情報は `docs/admin-password.txt` ファイル（git管理外）を参照してください。

## トラブルシューティング

### よくある問題
1. **認証エラー**: Supabase関数が正しく作成されているか確認
2. **マスクが効かない**: `mask_description`関数の存在確認
3. **トークンエラー**: `auth_tokens`テーブルのRLS設定確認

### デバッグ方法
- ブラウザのネットワークタブでAPI呼び出し確認
- コンソールでエラーログ確認
- Supabaseダッシュボードでログ確認

## 今後の拡張可能性

1. **複数パスワード対応**
2. **プロジェクト単位の権限管理**
3. **ログイン履歴の記録**
4. **セッション管理の改善**

---
実装日: 2025-01-06
実装者: Claude Code