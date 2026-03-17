import type { NextConfig } from "next";

// GitHub Pages 部署时，仓库通常挂载在 /repo-name 子路径下
// 若部署到自定义域名或 username.github.io 根路径，将此变量留空即可
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",       // 生成纯静态 HTML，适配 GitHub Pages
  trailingSlash: true,    // 路径末尾加斜杠，避免 GitHub Pages 404
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,    // 静态导出时关闭 Next.js 图片优化
  },
};

export default nextConfig;
