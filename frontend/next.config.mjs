const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/orders/:path*",
        destination: "http://localhost:8085/api/orders/:path*",
      },
      {
        source: "/api/billing/:path*",
        destination: "http://localhost:8088/api/billing/:path*",
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
        source: "/api/users/:path*",
        destination: "http://localhost:8081/api/users/:path*",
      },
      {
        source: "/api/roles/:path*",
        destination: "http://localhost:8081/api/roles/:path*",
      },
      {
        source: "/api/permissions/:path*",
        destination: "http://localhost:8081/api/permissions/:path*",
      },
      {
        source: "/api/v1/customers/:path*",
        destination: "http://localhost:8082/api/v1/customers/:path*",
      },
      {
        source: "/api/v1/suppliers/:path*",
        destination: "http://localhost:8087/api/v1/suppliers/:path*",
      },
      {
        source: "/api/v1/supplier-products/:path*",
        destination: "http://localhost:8087/api/v1/products/:path*",
      },
      {
        source: "/api/installations/:path*",
        destination: "http://localhost:8083/api/installations/:path*",
      },
      {
        source: "/api/technicians/:path*",
        destination: "http://localhost:8083/api/technicians/:path*",
      },
      {
        source: "/api/campaigns/:path*",
        destination: "http://localhost:8089/api/campaigns/:path*",
      },
    ];
  },
};

export default nextConfig;
