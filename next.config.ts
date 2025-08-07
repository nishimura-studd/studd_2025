import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // レンタルサーバー用の設定
  distDir: 'out',
  assetPrefix: ''
};

export default nextConfig;
