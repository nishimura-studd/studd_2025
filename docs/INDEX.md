# ドキュメントインデックス

このディレクトリには、プロジェクトの技術文書が含まれています。

## 🏛️ プロジェクト全体

- **[CLAUDE.md](../CLAUDE.md)** - Claude Code作業ガイダンス（アーキテクチャ全体と開発コマンド）
- **[TECH_OVERVIEW.md](./TECH_OVERVIEW.md)** - 技術概要とアーキテクチャ

## 🎵 DrumSync3D（3D音響ビジュアライゼーション）

- **[DRUMSYNC3D_TECHNICAL_IMPLEMENTATION_SPEC.md](./DRUMSYNC3D_TECHNICAL_IMPLEMENTATION_SPEC.md)** - 技術実装詳細
- **[DRUMSYNC3D_INTERACTIVE_MODE_SPEC.md](./DRUMSYNC3D_INTERACTIVE_MODE_SPEC.md)** - インタラクティブモード仕様

## 🔐 認証システム

- **[AUTHENTICATION_IMPLEMENTATION.md](./AUTHENTICATION_IMPLEMENTATION.md)** - 認証機能詳細実装
- **[admin-password.txt](./admin-password.txt)** - パスワード設定（git管理外）

## 🗄️ データベース・バックエンド

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabaseセットアップガイド
- **[SUPABASE_PERFORMANCE_OPTIMIZATION.md](./SUPABASE_PERFORMANCE_OPTIMIZATION.md)** - パフォーマンス最適化案
- **[WORKS_UPDATE_GUIDE.md](./WORKS_UPDATE_GUIDE.md)** - 作品データ更新ガイド

## 📁 その他の重要なファイル

### データベースファイル（supabase/）
- **[supabase/sql/supabase-auth-functions.sql](../supabase/sql/supabase-auth-functions.sql)** - 認証関数・RPC定義
- **[supabase/sql/supabase-schema.sql](../supabase/sql/supabase-schema.sql)** - データベーススキーマ
- **[supabase/scripts/import-csv.js](../supabase/scripts/import-csv.js)** - CSVデータインポートスクリプト

### ビルドスクリプト
- **[scripts/generate-build-time.js](../scripts/generate-build-time.js)** - ビルド時刻生成
- **[scripts/post-build-spa.js](../scripts/post-build-spa.js)** - .htaccess生成（レンタルサーバー用）

---

💡 **開発を始める前に**: [CLAUDE.md](../CLAUDE.md) を最初に読むことを推奨します。