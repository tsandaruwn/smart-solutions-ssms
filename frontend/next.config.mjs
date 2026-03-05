const nextConfig = {
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
      {
        source: "/api/products/:path*",
        destination: "http://localhost:8080/api/products/:path*",
      },
      {
        source: "/api/categories/:path*",
        destination: "http://localhost:8080/api/categories/:path*",
      },
      {
        source: "/api/campaigns/:path*",
        destination: "http://localhost:8088/api/campaigns/:path*",
      },
    ];
  },
};

export default nextConfig;
