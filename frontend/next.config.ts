import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/orders/:path*",
        destination: "http://localhost:8085/api/orders/:path*",
      },
      {
        source: "/api/billing/:path*",
        destination: "http://localhost:6543/api/billing/:path*",
      },
    ];
  },
};

export default nextConfig;
