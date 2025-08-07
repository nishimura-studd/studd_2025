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
  compress: false
};

export default nextConfig;
