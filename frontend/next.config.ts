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
      {
        source: "/api/payments/:path*",
        destination: "http://localhost:8086/api/payments/:path*",
      },
      {
        source: "/api/payment-methods/:path*",
        destination: "http://localhost:8086/api/payment-methods/:path*",
      },
      {
        source: "/api/v1/inventory/:path*",
        destination: "http://localhost:8084/api/v1/inventory/:path*",
      },
      {
        source: "/api/v1/warehouses/:path*",
        destination: "http://localhost:8084/api/v1/warehouses/:path*",
      },
    ];
  },
};

export default nextConfig;
