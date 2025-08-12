import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // レンタルサーバー用の設定
  distDir: 'out',
  assetPrefix: '',
  // 完全静的サイト用設定
  generateBuildId: () => 'studd-static',
  compress: false,
  // 本番ビルドでconsoleログを削除
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  // 開発環境でのhydration警告を抑制（ブラウザ拡張による影響を軽減）
  reactStrictMode: false,
  experimental: {
    suppressHydrationWarning: process.env.NODE_ENV === 'development'
  }
};

export default nextConfig;
