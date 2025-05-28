import type { NextConfig } from "next";

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
};

export default nextConfig;
