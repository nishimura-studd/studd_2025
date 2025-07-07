# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを操作する際のガイダンスを提供します。

## プロジェクト概要

Next.js 15とSupabaseを使用して構築されたポートフォリオサイト。プライベートプロジェクト用のパスワード保護されたコンテンツ管理と高度な認証システムが特徴です。

**技術スタック:**
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS（スタイリング）
- Supabase（バックエンド：PostgreSQL + 認証）
- Three.js + React Three Fiber（3Dビジュアル、計画中）

## 開発コマンド

```bash
# 開発
npm run dev                    # Turbopack使用で開発サーバー起動
npm run build                  # 本番用ビルド（静的エクスポート）
npm run lint                   # ESLint実行

# データインポート（CSV → Supabase）
npm run import-csv             # 基本的なCSVインポート
npm run import-with-images     # 画像処理付きCSVインポート
```

## アーキテクチャ概要

### 認証システム
サイトは2段階認証システムを実装：
- **公開アクセス**: プライベートプロジェクトのマスクされたデータ（タイトル → "**********"、説明 → 案内メッセージ）
- **認証済みアクセス**: パスワード入力後の完全なプロジェクトデータ

**主要コンポーネント:**
- `AuthContext` グローバル認証状態管理
- `PasswordModal` ログインUI処理
- Supabase RPC関数でbcrypt + トークン管理によるサーバーサイド認証

### データレイヤーアーキテクチャ

**Supabase関数（PostgreSQL）:**
- `authenticate_admin(password)` - bcryptによるパスワード検証、JWT風トークンを返却
- `get_works_with_auth(token?)` - プロジェクトリスト返却（認証状態に基づくマスク/非マスク）
- `get_work_by_id_with_auth(id, token?)` - 単一プロジェクト取得
- `mask_title()` と `mask_description()` - コンテンツマスクユーティリティ

**TypeScript APIレイヤー（`lib/api.ts`）:**
- `getPublicWorksAPI()` / `getAllWorksAPI()` - 公開 vs 認証済みデータアクセス
- localStorageによるトークン管理と自動有効期限切れ
- 認証レベルの異なる同一エンドポイント用デュアルAPIパターン

### Workデータモデル

```typescript
type Work = {
  id: string
  title: string
  terms: string | null        // "2024/02/06 → 2024/08/10" 形式
  skills: string[]           // 技術タグ
  description: string | null
  is_public: boolean         // マスク動作を制御
  image_url: string | null   // レガシー単一画像
  images: string[]          // 新機能：複数画像サポート
  project_url: string | null
  is_masked?: boolean       // APIからのランタイムフラグ
}
```

### UIコンポーネントアーキテクチャ

**レイアウト構造:**
- `app/layout.tsx` - AuthProviderラッパー付きルートレイアウト
- `app/components/Navigation.tsx` - グローバルナビゲーション
- `app/work/page.tsx` - フィルタリング + 認証モーダル付きプロジェクトリスト
- `app/work/[id]/page.tsx` - 複数画像サポート付きプロジェクト詳細ビュー

**認証フロー:**
1. ユーザーがマスクされたプロジェクトをクリック → `PasswordModal`が開く
2. パスワード送信 → `authenticateAdmin()` → トークン保存
3. `AuthContext`状態更新がデータ再取得をトリガー
4. マスクされたコンテンツが自動的に表示される

### ファイル構成

```
src/
├── app/                    # Next.js App Routerページ
│   ├── components/        # 共有UIコンポーネント
│   └── work/             # Work関連ページ
├── contexts/             # React Contextプロバイダー
├── lib/                  # コアユーティリティ
│   ├── api.ts           # Supabase APIラッパー
│   ├── supabase.ts      # クライアント設定 + 型
│   └── utils.ts         # ヘルパー関数
└── data/                 # データベースセットアップ
    └── supabase-auth-functions.sql
```

## 重要な実装詳細

### 環境設定
`.env.local`に以下が必要:
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**セキュリティ注意**: これらはRLS（Row Level Security）で保護されているため、静的ビルドで公開されても安全です。

### デプロイ設定
- **対象**: レンタルサーバーホスティング用静的サイト生成
- **ビルド出力**: `npm run build`後の`out/`ディレクトリ
- 環境変数はビルド時に埋め込まれる

### データベーススキーマ注意事項
- Worksテーブルは`image_url`（レガシー）と`images[]`（新しい複数画像サポート）両方を含む
- プロジェクトは`terms`フィールドから抽出した開始年でソート: `extract_start_year(terms) DESC`
- 機密テーブル（`admin_config`、`auth_tokens`）でRLS有効

### 認証パスワード
現在のシステムパスワード: `open sesame`

## 重要なファイルの場所

- 認証実装詳細: `docs/AUTHENTICATION_IMPLEMENTATION.md`
- データベース関数: `data/supabase-auth-functions.sql`
- CSVインポートスクリプト: `scripts/`ディレクトリ
- Workデータ型定義: `src/lib/supabase.ts`
- 技術文書一覧: `docs/README.md`