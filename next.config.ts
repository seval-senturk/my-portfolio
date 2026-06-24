import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icons/favicon.ico",
      },
    ];
  },
};

export default nextConfig;
