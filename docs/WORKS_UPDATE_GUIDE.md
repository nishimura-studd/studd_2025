# Works更新手順ガイド

このドキュメントでは、プロジェクト（works）データの更新手順と、ビルドが必要な場合・不要な場合を説明します。

## 更新の種類とビルド要否

### 🔄 **再ビルド不要（即座に反映）**

既存プロジェクトの以下の更新は、DBを更新するだけで即座にサイトに反映されます：

- **プロジェクト内容の更新**
  - タイトル（title）
  - 説明文（description）
  - 期間（terms）
  - スキル・技術タグ（skills）
  - プロジェクトURL（project_url）
  - 画像数（image_count）
  - 公開・非公開設定（is_public）

**理由:** 詳細ページは完全にクライアントサイドレンダリングを採用しており、ページ表示時にSupabaseから最新データを取得するため。

### 🏗️ **再ビルド必要**

以下の場合は `npm run build` による再ビルドが必要です：

- **新しいプロジェクトの追加**
  - 新しいwork IDを追加した場合
  - 例：work ID 83を新規追加

**理由:** `generateStaticParams()`により事前に静的HTMLファイル（`/works/83/index.html`）を生成する必要があるため。

- **プロジェクトの削除**
  - 既存のwork IDを削除した場合
  - 削除されたIDのページが404になることを防ぐため

## 更新手順

### 既存プロジェクトの更新

1. **Supabaseでデータを更新**
   - `works`テーブルの該当レコードを編集
   - 画像ファイルがある場合は `https://studd.jp/images/works/` に配置

2. **確認**
   - サイトで該当プロジェクトページを開く
   - 変更が反映されていることを確認
   - ブラウザのハードリロード（Cmd+Shift+R）推奨

### 新しいプロジェクトの追加

1. **Supabaseでデータを追加**
   - `works`テーブルに新しいレコードを挿入
   - `id`, `title`, `description`等の必要項目を設定

2. **画像ファイルの配置**（画像がある場合）
   - `https://studd.jp/images/works/{id}_0.jpg`
   - `https://studd.jp/images/works/{id}_1.jpg`
   - ...（image_countに応じて）

3. **サイトの再ビルド**
   ```bash
   npm run build
   ```

4. **デプロイ**
   - `out/` ディレクトリをサーバーにアップロード

5. **確認**
   - 新しいプロジェクトページが表示されることを確認
   - 一覧ページに表示されることを確認

## 技術的背景

### レンタルサーバー制約とアーキテクチャ選択

本サイトは**レンタルサーバー**（Apache）での運用を前提としており、以下の制約があります：

#### レンタルサーバーの制約
- ❌ **Node.js実行環境なし**: サーバーサイドでJavaScriptを実行できない
- ❌ **SSR（Server-Side Rendering）不可**: Next.jsの動的レンダリング機能が使用不可
- ❌ **API Routes不可**: Next.jsのAPI機能が使用不可
- ✅ **静的ファイル配信のみ**: HTML、CSS、JS、画像などの静的ファイルのみ配信可能

#### 解決策：SSGとCSRのハイブリッド構成

この制約を解決するため、**静的サイト生成（SSG）** と **クライアントサイドレンダリング（CSR）** を組み合わせた独自のハイブリッド構成を採用しました：

**ビルドプロセス（開発環境）:**
```bash
npm run build  # Next.jsでSSG実行 → out/ディレクトリに静的ファイル生成
```

**デプロイプロセス:**
```bash
# out/ディレクトリをレンタルサーバーにアップロード
# レンタルサーバーは静的ファイルとして配信
```

**データ取得戦略:**
- **静的部分**: ページ構造、メタデータ
- **動的部分**: プロジェクトコンテンツ（Supabase経由でクライアントサイドから直接取得）

### 静的サイト生成（SSG）とクライアントサイドレンダリング（CSR）のハイブリッド構成

この制約下で、本サイトは以下の構成を採用しています：

#### プロジェクト一覧ページ（`/works`）
- **静的生成**: ビルド時にプロジェクト一覧を生成
- **動的更新**: 認証後の詳細データはクライアントサイドで取得

#### プロジェクト詳細ページ（`/works/[id]`）
- **URLの静的生成**: `generateStaticParams()`でIDベースのパスを事前生成
- **コンテンツの動的取得**: ページ表示時にSupabaseから最新データを取得

```typescript
// generateStaticParams() - ビルド時実行
export async function generateStaticParams() {
  const works = await getPublicWorksAPI()
  return works.map((work) => ({
    id: work.id.toString(), // これにより /works/1/, /works/2/ ... が生成される
  }))
}

// WorkDetailClient - ページ表示時実行
useEffect(() => {
  // 毎回最新データを取得
  const data = await getPublicWorkByIdAPI(Number(workId))
  setWork(data)
}, [])
```

### この構成の利点

1. **レンタルサーバー対応**: Node.js不要で静的ファイルのみでWebアプリケーションを実現
2. **コスト効率**: 高価なVPSやクラウドサービス不要
3. **SEO対応**: 各プロジェクトページが個別URLで静的HTML生成
4. **高速表示**: 静的ファイルによる高速な初期表示
5. **リアルタイム更新**: コンテンツは常に最新データ
6. **運用効率**: 既存プロジェクトの更新は即座に反映
7. **スケーラビリティ**: Supabaseにより大量データにも対応

### 制約とトレードオフ

- **新規追加時の再ビルド**: 新しいプロジェクト追加時は開発環境でのビルドが必要
- **初回ローディング**: ページ表示時にSupabaseからのデータ取得時間
- **開発環境依存**: ビルドプロセスはNode.js環境が必要（本番環境では不要）

## トラブルシューティング

### Q: 更新したのに変更が反映されない

**A:** 以下を確認してください：

1. **ブラウザキャッシュ**: ハードリロード（Cmd+Shift+R / Ctrl+Shift+R）
2. **更新対象**: 新規プロジェクト追加の場合は再ビルドが必要
3. **Supabaseデータ**: DBに正しく反映されているか確認
4. **認証状態**: プライベートプロジェクトの場合は認証が必要

### Q: 新しいプロジェクトページが404になる

**A:** 新規プロジェクト追加時は再ビルドが必要です：

```bash
npm run build
# out/ ディレクトリをサーバーにアップロード
```

### Q: 画像が表示されない

**A:** 以下を確認してください：

1. **画像ファイルパス**: `https://studd.jp/images/works/{id}_{index}.jpg`
2. **image_count設定**: Supabaseの`image_count`フィールドが正しい値
3. **ファイル存在**: 実際に画像ファイルがサーバーに配置されているか

## レンタルサーバー固有の設定

### .htaccess設定
レンタルサーバーでNext.jsのApp Routerを動作させるため、以下の設定を自動生成：

```apache
# App Router用リライトルール（post-build-spa.jsで自動生成）
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^works/([0-9]+)/?$ /works/$1/index.html [L]
```

### ビルド設定
```javascript
// next.config.ts
export default {
  output: 'export',  // 静的エクスポート
  trailingSlash: true,
  images: {
    unoptimized: true  // 画像最適化無効（レンタルサーバー対応）
  }
}
```

## 関連ファイル

### アプリケーション
- **静的パス生成**: `src/app/works/[id]/page.tsx`
- **動的データ取得**: `src/app/works/[id]/WorkDetailClient.tsx`
- **API関数**: `src/lib/api.ts`
- **認証システム**: `src/contexts/AuthContext.tsx`

### ビルド・デプロイ
- **ビルドスクリプト**: `package.json` の `build` スクリプト`
- **静的化設定**: `next.config.ts`
- **レンタルサーバー設定**: `scripts/post-build-spa.js`

### データベース
- **Supabase設定**: `src/lib/supabase.ts`
- **認証関数**: `supabase/sql/supabase-auth-functions.sql`

---

最終更新: 2025年8月10日