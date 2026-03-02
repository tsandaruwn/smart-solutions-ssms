import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/orders/:path*",
        destination: "http://localhost:8085/api/orders/:path*",
      },
    ];
  },
};

export default nextConfig;
