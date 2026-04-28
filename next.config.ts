import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      useSystemTlsCerts: true,
    },
  },
};

export default nextConfig;
