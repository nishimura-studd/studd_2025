# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Next.js 15とSupabaseを使用して構築されたポートフォリオサイト。プライベートプロジェクト用のパスワード保護されたコンテンツ管理と3D音響ビジュアライゼーションを統合した先進的なアーキテクチャが特徴です。

**技術スタック:**
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS（スタイリング）
- Supabase（バックエンド：PostgreSQL + 認証）
- Three.js + Web Audio API（3D音響ビジュアライゼーション）
- stats.js（パフォーマンス監視）

## 開発コマンド

```bash
# 開発
npm run dev                    # Turbopack使用で開発サーバー起動
npm run build                  # 本番用ビルド（静的エクスポート） + レンタルサーバー用設定
npm run build:next             # Next.jsビルドのみ（post-build無し）
npm run start                  # 本番サーバー起動（注意：静的エクスポート時は使用不可）
npm run lint                   # ESLint実行

# 静的サイト確認
npx serve out                  # ローカルで静的サイトをプレビュー

# データ管理
npm run import-csv             # CSVファイルからSupabaseにデータインポート
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
  id: number                  // INTEGER PRIMARY KEY
  title: string
  terms: string | null        // "2024/02/06 → 2024/08/10" 形式
  skills: string[]           // 技術タグ
  description: string | null
  is_public: boolean         // マスク動作を制御
  image_count: number | null // 画像数
  project_url: string | null
  is_masked?: boolean       // APIからのランタイムフラグ
}
```

### DrumSync3Dシステム（メインページ）

**音響ビジュアライゼーションアーキテクチャ:**
- `DrumSync3D.tsx` - React統合レイヤー（クライアントサイド）
- `DrumSync3DApp.js` - アプリケーションコーディネーター
- `three-renderer.js` - 3Dレンダリングシステムの統合ポイント
- `drum-system.js` - Web Audio APIベースの音響システム

**3Dレンダリングモジュール（`lib/three/`）:**
- `scene-manager.js` - シーン、ライティング、地面、Stats.js統合
- `camera-system.js` - ガイドスフィア追従カメラ（軌道運動 + 動的高度変化）
- `guide-sphere.js` - 前進移動するガイドスフィア（左右蛇行付き）
- `object-spawner.js` - 音響同期3Dオブジェクト生成（16+ GLBモデル）

**音響システム（`lib/sounds/`）:**
- `sound-engine.js` - Web Audio合成エンジン（サンプル不使用）
- `loop-patterns.js` - ドラムパターン定義（electronica、noisy、clickhouse、jersey club）
- 自動パターン切替（2ループごと）+ 音響→3Dオブジェクト生成マッピング

**データフロー:** LoopPattern → DrumSystem.triggerSound() → onSoundCallback → ThreeRenderer.triggerAnimation() → ObjectSpawner + GuideSphere

### UIコンポーネントアーキテクチャ

**レイアウト構造:**
- `app/layout.tsx` - AuthProviderラッパー付きルートレイアウト
- `app/components/Navigation.tsx` - 条件付きナビゲーション（ホームページのみ表示）
- `app/page.tsx` - DrumSync3Dフルスクリーン統合
- `app/about/page.tsx` - Profile + Skills + Contact統合ページ
- `app/works/page.tsx` - フィルタリング + 認証モーダル付きプロジェクトリスト
- `app/works/[id]/page.tsx` - 複数画像サポート付きプロジェクト詳細ビュー

**ナビゲーション設計:**
- ホーム: 左上「studd. / スタッド.」ロゴ + 右上「about」リンク
- 他ページ: ナビゲーション非表示、各ページ内で独自ナビゲーション

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
│   │   ├── DrumSync3D.tsx   # 3D音響ビジュアライゼーション
│   │   ├── Navigation.tsx   # 条件付きナビゲーション
│   │   ├── PasswordModal.tsx # 認証モーダル
│   │   └── WorkItem.tsx     # プロジェクト表示
│   ├── about/            # Profile + Skills + Contact統合
│   └── works/            # Works関連ページ
├── contexts/             # React Contextプロバイダー
├── lib/                  # コアユーティリティ + 3D/音響システム
│   ├── api.ts           # Supabase APIラッパー
│   ├── supabase.ts      # クライアント設定 + 型
│   ├── utils.ts         # ヘルパー関数
│   ├── DrumSync3DApp.js  # 3D音響アプリケーションコーディネーター
│   ├── three-renderer.js # 3Dレンダリング統合
│   ├── three/           # モジュラー3Dシステム
│   │   ├── scene-manager.js    # シーン + ライティング + Stats.js
│   │   ├── camera-system.js    # 軌道カメラシステム
│   │   ├── guide-sphere.js     # 前進ガイドスフィア
│   │   └── object-spawner.js   # 音響同期オブジェクト生成
│   └── sounds/          # Web Audio音響システム
│       ├── drum-system.js      # 高レベル音響コーディネーター
│       ├── sound-engine.js     # 低レベルWeb Audio合成
│       └── loop-patterns.js    # ドラムパターン定義
├── data/                 # データベースセットアップ
│   └── supabase-auth-functions.sql
└── public/
    └── assets/
        └── glb/          # 3Dモデルアセット（16+ GLBファイル）
```

## 重要な実装詳細

### 3D音響システムの重要な考慮事項

**Web Audio制約:**
- ブラウザセキュリティによりユーザーインタラクション必須
- DrumSync3Dは初回クリックで自動音声初期化（コンテナ内クリックのみ）
- ナビゲーションリンククリックでは音声初期化されない設計

**パフォーマンス設定:**
- Stats.js統合（現在無効化、必要時に`scene-manager.js`で有効化可能）
- オブジェクト数制限（100個）で自動クリーンアップ
- フレームレート独立アニメーション（deltaTime使用）

**3Dアセット管理:**
- GLBファイル（16+モデル）は`public/assets/glb/`に配置
- 音響-オブジェクトマッピング: kick→tree、snare→house等
- セクターベース配置システム（8セクター、重複回避）

### 環境設定
`.env.local`に以下が必要:
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**セキュリティ注意**: これらはRLS（Row Level Security）で保護されているため、静的ビルドで公開されても安全です。

### 静的サイト生成（SSG）アーキテクチャ

**ビルドプロセス:**
1. `next build` - App Router使用でSSG生成（82個の作品詳細ページを含む）
2. `generateStaticParams()` - Supabaseから作品IDを取得し静的パラメータ生成
3. `post-build-spa.js` - レンタルサーバー用の.htaccessファイル生成

**生成されるファイル:**
- `out/index.html` - ホームページ（DrumSync3D）
- `out/about.html` - aboutページ
- `out/works.html` - 作品一覧ページ
- `out/works/[1-82].html` - 各作品詳細ページ（事前レンダリング済み）
- `out/.htaccess` - App Router用リライトルール

### サーバー・クライアント分離パターン

**works/[id]/page.tsx:**
- Server Component: `generateStaticParams()` + 初期データ取得
- Client Component: `WorkDetailClient.tsx` で認証後の動的データ更新

### デプロイ設定
- **対象**: レンタルサーバー（Apache）
- **ビルド出力**: `out/`ディレクトリをそのままアップロード
- **認証後データ更新**: クライアントサイドでSupabase APIから再取得

### データベーススキーマ注意事項
- `image_count`フィールドで画像数管理（`https://studd.jp/images/works/{id}_{index}.png`）
- プロジェクトソート: `id DESC`（最新IDが上位表示）
- RLS有効テーブル: `admin_config`, `auth_tokens`

### 認証システム詳細
認証パスワードは別途管理されています。

## 重要な開発ノート

### App Router + 静的エクスポートの制約
- `npm run start`は`output: 'export'`設定時に使用不可
- 開発時は`npm run dev`、本番確認は`npx serve out`を使用
- 動的ルート`works/[id]`は`generateStaticParams()`で静的化

### 認証システムの二重構造
- **静的HTML**: 公開データ（マスク済み）を事前レンダリング
- **認証後**: クライアントサイドでフルデータに動的更新
- パスワード認証により`AuthContext`の`isAuthenticated`がトリガー

### 3D音響システムの初期化
- Web Audio APIはユーザーインタラクション必須
- DrumSync3Dコンテナ内クリックで音声開始
- ナビゲーションリンククリックでは音声非開始

### パフォーマンス最適化
- 82個の作品詳細ページを事前生成（SEO最適化）
- 画像は外部URL（`https://studd.jp/images/works/`）参照
- Three.jsオブジェクト数制限（100個）で自動クリーンアップ

## 重要なファイル

### コア設定
- `next.config.ts` - 静的エクスポート + レンタルサーバー設定
- `scripts/post-build-spa.js` - .htaccess生成とSPA対応
- `src/lib/supabase.ts` - データ型定義とクライアント設定
- `src/lib/api.ts` - 認証分岐APIレイヤー

### 認証システム
- `src/contexts/AuthContext.tsx` - グローバル認証状態
- `src/app/components/PasswordModal.tsx` - ログインUI
- `src/app/works/[id]/WorkDetailClient.tsx` - 認証後データ更新

### 3D音響システム
- `src/lib/DrumSync3DApp.js` - アプリケーション統合
- `src/lib/three-renderer.js` - Three.js統合ポイント
- `src/lib/sounds/sound-engine.js` - Web Audio合成エンジン