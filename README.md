# studd. | スタッド.

3D 音響ビジュアライゼーションを統合したポートフォリオサイト（2025年版）

## 概要

React 19 + Next.js 15 の App Router アーキテクチャを基盤に、3D 音響ビジュアライゼーションと制作事例に Supabase PostgreSQL バックエンドを使用したフルスタックポートフォリオサイトです。制作事例では静的サイト生成（SSG）による事前レンダリングと、認証システムによる段階的コンテンツ開示を実現しています。

## 主要機能

### 1. リアルタイム 3D 音響ビジュアライゼーション
- Web Audio API による16種類の音響合成（サンプル不使用）
- Three.js との音響同期オブジェクト生成システム
- ガイドスフィア追従カメラシステム + 軌道運動
- PAD ベースドラムコントローラー（レスポンシブ対応）
- モジュラーアーキテクチャ設計: 音響パターン → DrumSystem → 3D オブジェクト生成

### 2. 認証アーキテクチャ
- bcrypt + JWT 風トークンによるサーバーサイド認証
- 静的 HTML 事前生成 → 認証後の動的データ更新
- RPC 関数によるマスク/非マスク切り替え機能
- 詳細ページを SSG で事前生成（SEO 最適化）
- パスワード認証による段階的コンテンツ開示

### 3. パフォーマンス最適化
- フレームレート独立アニメーション（deltaTime 使用）
- Next.js 15 App Router による82作品の事前レンダリング
- レンタルサーバー対応の完全静的サイト出力

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + RLS + bcrypt 認証)
- **3D グラフィックス**: Three.js + WebGL
- **音響処理**: Web Audio API (サンプルレス音響合成)
- **デプロイ**: 静的サイト生成 + Apache（レンタルサーバー）

## セットアップ

### 必要環境
- Node.js 18.0 以降
- WebGL 2.0 対応ブラウザ（ Chrome, Firefox, Safari 推奨）
- Web Audio API 対応ブラウザ

### インストール
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ Turbopack 使用）
npm run dev

# 本番ビルド（静的サイト生成）
npm run build

# 静的サイトのローカル確認
npx serve out
```

### 環境変数設定
`.env.local` ファイルを作成し、 Supabase 接続情報を設定:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### アクセス
- 開発: `http://localhost:3000`
- 静的サイト確認: `http://localhost:3000`（ npx serve 実行時）

## ファイル構成

```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト + 認証プロバイダー
│   ├── page.tsx          # ホーム（ DrumSync3D ）
│   ├── about/            # プロフィールページ
│   ├── works/            # 作品一覧・詳細
│   └── components/       # 共有 UI コンポーネント
│       ├── DrumSync3D.tsx      # 3D 音響ビジュアライゼーション
│       ├── InteractiveController.tsx # ドラムコントローラー
│       ├── PasswordModal.tsx    # 認証モーダル
│       └── WorkItem.tsx        # 作品表示コンポーネント
├── lib/                  # コアライブラリ
│   ├── api.ts           # Supabase API ラッパー
│   ├── supabase.ts      # DB 接続・型定義
│   ├── DrumSync3DApp.js # 3D 音響統合アプリ
│   ├── three/           # Three.js 3D システム
│   └── sounds/          # Web Audio 音響システム
├── contexts/            # React Context
├── public/assets/glb/   # 3D モデルアセット（16種類）
└── out/                # ビルド出力（静的サイト）
```

## 特徴的な機能

### DrumSync3D インタラクティブ操作
- **自動モード**: electronica → noisy → clickhouse → jersey club の4パターン自動再生
- **インタラクティブモード**: 
  - キーボード操作: Q-I 行（上段8 PAD ）、 A-K 行（下段8 PAD ）
  - タッチ操作: 4x4 グリッドレイアウト（モバイル対応）
  - カテゴリ別色分け: DRUMS （赤）、 SYNTH （青）、 FX （橙）、 MINIMAL （緑）

### 認証システム
- パスワード認証によるプライベートコンテンツへのアクセス制御
- 未認証時は作品タイトルが「**********」でマスク
- 認証後は全作品の詳細情報にアクセス可能

### プロジェクトデータ管理
- Supabase データベースで82作品を管理
- 各作品に複数画像対応（ `image_count` フィールドで管理）
- 技術タグによる作品フィルタリング機能

## デプロイ

本プロジェクトは静的サイト生成（SSG）によりレンタルサーバーにデプロイ可能：

```bash
# 本番ビルド
npm run build

# out/ フォルダの内容をサーバーにアップロード
```

## 技術的挑戦

- Three.js + Web Audio API のパフォーマンス同期
- 静的エクスポート環境での動的認証実装
- レンタルサーバー環境での App Router 対応

## 動作確認済み環境

- **デスクトップ**: Chrome, Firefox, Safari, Edge (最新版)
- **モバイル**: iOS Safari, Android Chrome
- **Web Audio API**: ユーザーインタラクション後に音声開始（ブラウザ仕様）

## 公開サイト
 [https://studd.jp/](https://studd.jp/) 

## ライセンス

MIT License  
使用ライブラリも全て MIT 互換ライセンス（商用利用可）