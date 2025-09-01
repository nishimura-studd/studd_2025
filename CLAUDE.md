# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Next.js 15とSupabaseを使用して構築されたポートフォリオサイト。プライベートプロジェクト用のパスワード保護されたコンテンツ管理と3D音響ビジュアライゼーションを統合した先進的なアーキテクチャが特徴です。

**技術スタック:**
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS（スタイリング）
- Supabase（バックエンド：PostgreSQL + 認証）
- Three.js + Web Audio API（3D音響ビジュアライゼーション）
- stats.js（パフォーマンス監視、現在無効化）

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

# デバッグ・開発支援
Ctrl+G                         # デザイングリッド表示切替（DesignGrid）
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

**重要**: 全てのデータアクセスはこれらのRPC関数経由で行われ、直接テーブルアクセスは使用していません。

**TypeScript APIレイヤー（`lib/api.ts`）:**
- `getPublicWorksAPI()` / `getAllWorksAPI()` - 公開 vs 認証済みデータアクセス
- localStorageによるトークン管理と自動有効期限切れ
- 認証レベルの異なる同一エンドポイント用デュアルAPIパターン

**直接データアクセス（`lib/works.ts`）:**
- `getPublicWorks()` / `getAllWorks()` - Supabase直接アクセス関数
- `getWorkById(id)` - 単一作品取得
- `getWorksBySkill(skill)` - スキル絞り込み検索
- Server Componentでの静的生成時に使用

**画像管理:**
- レンタルサーバー側に手動配置
- `image_count`フィールドで画像数を管理

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

**インタラクティブコントローラーシステム:**
- `InteractiveController.tsx` - PADベースのドラムコントローラーUI（4x4グリッド）
- `PadButton.tsx` - 個別PADコンポーネント（カテゴリ別色分け、レスポンシブ対応）
- キーボードマッピング: Q-I行（上段）、A-K行（下段）でPAD操作
- 自動モード↔インタラクティブモード切替機能

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

**インタラクティブコントローラーUI:**
- PC版: 2行8列レイアウト + カテゴリ別凡例表示
- タブレット版: 4行4列レイアウト（768px以下）
- SP版: 4行4列レイアウト、凡例・キーボード表記非表示、×ボタンデザイン
- レスポンシブPADサイズ調整とタッチ操作最適化

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
│   │   ├── InteractiveController.tsx # PADベースドラムコントローラー
│   │   ├── PadButton.tsx    # 個別PADコンポーネント
│   │   ├── Navigation.tsx   # 条件付きナビゲーション
│   │   ├── PasswordModal.tsx # 認証モーダル
│   │   ├── WorkItem.tsx     # プロジェクト表示
│   │   └── DesignGrid.tsx   # 開発用グリッド表示（Ctrl+G切替）
│   ├── about/            # Profile + Skills + Contact統合
│   └── works/            # Works関連ページ
├── contexts/             # React Contextプロバイダー
├── lib/                  # コアユーティリティ + 3D/音響システム
│   ├── api.ts           # Supabase APIラッパー（認証付き）
│   ├── works.ts         # 直接データアクセス関数
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
├── generated/            # ビルド時生成ファイル
│   └── build-time.ts    # ビルド時刻（自動生成）
├── data/                 # データベースセットアップ
│   └── supabase-auth-functions.sql
├── scripts/             # ビルドスクリプト
│   ├── generate-build-time.js  # ビルド時刻生成
│   └── post-build-spa.js       # .htaccess生成
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

**セキュリティ注意**: これらの変数は`NEXT_PUBLIC_`プレフィックス付きのため静的ビルドに含まれます。Supabase anon keyは公開前提で設計されており、RPC関数による適切な認証・マスク処理で保護されています。

### 静的サイト生成（SSG）アーキテクチャ

**ビルドプロセス:**
1. `generate-build-time.js` - ビルド時刻を`src/generated/build-time.ts`に生成
2. `next build` - App Router使用でSSG生成（82個の作品詳細ページを含む）
3. `generateStaticParams()` - Supabaseから作品IDを取得し静的パラメータ生成  
4. `post-build-spa.js` - レンタルサーバー用の.htaccessファイル生成

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
- `image_count`フィールドで画像数管理（`https://studd.jp/images/works/{id}_{index}.jpg`）
- プロジェクトソート: `id DESC`（最新IDが上位表示）
- RLS有効テーブル: `admin_config`, `auth_tokens`, `works`

**重要なRLS設定:**
- `works`テーブルには`USING (true)`ポリシーがあるが、実際のアプリケーションは`get_works_with_auth()`RPC関数経由でアクセス
- RPC関数内で適切な認証チェックとマスク処理を実装済み
- 直接テーブルアクセスポリシーは削除可能（セキュリティ向上のため）

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

### インタラクティブコントローラーの操作方法
- **アクセス**: ホームページ右下のコントローラーアイコンからモード切替
- **キーボード操作**: 
  - 上段: Q(kick), W(snare), E(hihat), R(openHihat), T(synthbass), Y(synthlead), U(synthpad), I(808kick)
  - 下段: A(glitch), S(static), D(distortionblast), F(vocalchop), G(click), H(sequencer), J(metalclick), K(minimalbass)
- **PADカテゴリ**: DRUMS（赤）、SYNTH（青）、FX（橙）、MINIMAL（緑）
- **レスポンシブ対応**: PC（2x8）→タブレット（4x4）→SP（4x4、凡例・キー表記非表示）

### パフォーマンス最適化
- 82個の作品詳細ページを事前生成（SEO最適化）
- 画像は外部URL参照でCDN効果による高速配信
- Three.jsオブジェクト数制限（100個）で自動クリーンアップ
- **Supabaseパフォーマンス**: RPC関数でレスポンス遅延・タイムアウトが稀に発生
  - 詳細は `docs/SUPABASE_PERFORMANCE_OPTIMIZATION.md` を参照
  - 改善案: タイムアウト設定、インデックス追加、キャッシュ実装

## 重要なファイル

### コア設定
- `next.config.ts` - 静的エクスポート + レンタルサーバー設定
- `scripts/post-build-spa.js` - .htaccess生成とSPA対応
- `scripts/generate-build-time.js` - ビルド時刻自動生成
- `src/lib/supabase.ts` - データ型定義とクライアント設定
- `src/lib/api.ts` - 認証分岐APIレイヤー
- `src/lib/works.ts` - 直接データアクセス関数（SSG用）

### 認証システム
- `src/contexts/AuthContext.tsx` - グローバル認証状態
- `src/app/components/PasswordModal.tsx` - ログインUI
- `src/app/works/[id]/WorkDetailClient.tsx` - 認証後データ更新

### 3D音響システム
- `src/lib/DrumSync3DApp.js` - アプリケーション統合
- `src/lib/three-renderer.js` - Three.js統合ポイント
- `src/lib/sounds/sound-engine.js` - Web Audio合成エンジン

### ドキュメント
- `docs/INDEX.md` - 全ドキュメントのインデックス（開発開始時に参照推奨）
- `docs/SUPABASE_PERFORMANCE_OPTIMIZATION.md` - Supabaseパフォーマンス最適化案
- `docs/AUTHENTICATION_IMPLEMENTATION.md` - 認証システム実装詳細
- `docs/WORKS_UPDATE_GUIDE.md` - 作品データ更新ガイド
- `docs/DRUMSYNC3D_TECHNICAL_IMPLEMENTATION_SPEC.md` - DrumSync3D技術仕様
- `docs/TECH_APPEAL.md` - 技術概要とアピールポイント

## 開発時の重要な注意事項

### セキュリティチェックリスト
- `.env.local`ファイルが`.gitignore`で除外されているか確認
- RPC関数`get_works_with_auth()`による適切なマスク処理が動作することを確認
- 認証トークンの有効期限（1時間）が適切に管理されているか確認

### デバッグツール
- Stats.jsは`scene-manager.js:3`で無効化（有効にする場合はコメントアウト解除）
- DesignGridは`Ctrl+G`で表示切替可能
- ブラウザ開発者ツールでWeb Audio APIのコンテキスト状態を確認可能

### 追加リソース
- プロジェクト全体の理解: `docs/INDEX.md`で全ドキュメントを確認
- 技術的詳細: `docs/TECH_APPEAL.md`で技術アピールポイント参照
- DrumSync3D詳細: `docs/DRUMSYNC3D_TECHNICAL_IMPLEMENTATION_SPEC.md`参照