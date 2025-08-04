# Supabase セットアップ手順

## 1. Supabase プロジェクト作成

1. [Supabase](https://supabase.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURL とAPI キーを取得

## 2. Storage バケットの作成

1. Supabase ダッシュボードで「Storage」に移動
2. 新しいバケット「work-images」を作成
3. バケットを **Public** に設定（パブリック読み取り可能）

## 3. 環境変数の設定

`.env.local` ファイルに以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. データベーステーブル作成

Supabase のSQL エディタで `data/supabase-schema.sql` を実行：

```sql
-- 作品データ用のテーブル作成
CREATE TABLE works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  category TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 続きは data/supabase-schema.sql を参照
```

## 5. 作品データの登録

### 方法1: 画像なしでデータのみ登録
```bash
npm run import-csv
```

### 方法2: 画像付きで登録（推奨）
```bash
npm run import-with-images
```

**注意**: `data/works.csv` に作品データを配置してください。

### CSV フォーマット
```csv
title,terms,skills,description,is_public,image_url,project_url
"プロジェクト名","2024年","React,TypeScript","プロジェクトの説明",true,"","https://project.com"
```

**フィールド説明：**
- **title**: 作品タイトル
- **terms**: 期間・年度
- **skills**: 使用技術（カンマ区切り）
- **description**: 作品説明
- **is_public**: 公開フラグ（true/false）
- **image_url**: 画像URL（今回は空）
- **project_url**: プロジェクトURL

## 6. MCP サーバー設定（オプション）

Claude Code の MCP を使用してローカルから Supabase を操作したい場合：

1. `@supabase/supabase-js` がインストール済み
2. `lib/supabase.ts` でクライアント設定済み
3. `scripts/import-csv.js` でデータインポート機能実装済み

## ファイル構成

```
├── .env.local                 # 環境変数（gitignore対象）
├── lib/supabase.ts           # Supabase クライアント
├── lib/storage.ts            # 画像アップロード機能
├── scripts/import-csv.js     # CSV インポートスクリプト
├── scripts/import-with-images.js # 画像付きインポート
├── data/                     # データファイル（gitignore対象）
│   ├── supabase-schema.sql   # テーブル定義
│   └── works.csv             # 作品データ
└── SUPABASE_SETUP.md         # このファイル
```

## テーブル構造

### works テーブル
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | 主キー |
| title | TEXT | 作品タイトル |
| terms | TEXT | 期間・年度 |
| skills | TEXT[] | 使用技術（配列） |
| description | TEXT | 作品説明 |
| is_public | BOOLEAN | 公開フラグ |
| image_url | TEXT | 画像URL |
| project_url | TEXT | プロジェクトURL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |