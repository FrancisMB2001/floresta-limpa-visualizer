import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/visualizer',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
