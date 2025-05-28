import type { NextConfig } from "next";

const getAutoBaseUrl = () => {
  // 本地开发强制使用 localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "production") {
    return "http://162.14.126.179";
  }
  // 获取 Vercel 全环境统一域名
  const vercelUrl = process.env.VERCEL_URL;
  // 安全回退机制
  if (!vercelUrl) {
    console.warn("VERCEL_URL not detected, fallback to localhost");
    return "http://localhost:3000";
  }
  // 自动补全 HTTPS 协议（VERCEL_URL 可能不带协议）
  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
};
const nextConfig: NextConfig = {
  // transpilePackages: ["docx", "prosemirror-docx"],
  /* config options here */
  rewrites: async () => {
    return [
      {
        source: "/:path*", // 匹配所有路径
        destination: `/:path*`, // 保持路径一致性
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "47.109.205.159",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: getAutoBaseUrl(),
  },
};

export default nextConfig;
