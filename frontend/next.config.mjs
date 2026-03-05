const nextConfig = {
  async rewrites() {
    const isDocker = process.env.DOCKER === "true";
    const host = (service, port) =>
      isDocker ? `http://${service}:${port}` : `http://localhost:${port}`;

    return [
      // User Management → 8080
      {
        source: "/api/users/:path*",
        destination: `${host("user-management", 8080)}/api/users/:path*`,
      },
      {
        source: "/api/roles/:path*",
        destination: `${host("user-management", 8080)}/api/roles/:path*`,
      },
      {
        source: "/api/permissions/:path*",
        destination: `${host("user-management", 8080)}/api/permissions/:path*`,
      },
      // Customer Management → 8081
      {
        source: "/api/v1/customers/:path*",
        destination: `${host("customer-service", 8081)}/api/v1/customers/:path*`,
      },
      // Product Management → 8082
      {
        source: "/api/products/:path*",
        destination: `${host("product-management", 8082)}/api/products/:path*`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${host("product-management", 8082)}/api/categories/:path*`,
      },
      // Inventory Management → 8083
      {
        source: "/api/v1/inventory/:path*",
        destination: `${host("inventory-management", 8083)}/api/v1/inventory/:path*`,
      },
      {
        source: "/api/v1/warehouses/:path*",
        destination: `${host("inventory-management", 8083)}/api/v1/warehouses/:path*`,
      },
      // Order Management → 8084
      {
        source: "/api/orders/:path*",
        destination: `${host("order-management", 8084)}/api/orders/:path*`,
      },
      // Billing & Invoice → 8085
      {
        source: "/api/billing/:path*",
        destination: `${host("billing-and-invoice", 8085)}/api/billing/:path*`,
      },
      // Payment Management → 8086
      {
        source: "/api/payments/:path*",
        destination: `${host("payment-management", 8086)}/api/payments/:path*`,
      },
      {
        source: "/api/payment-methods/:path*",
        destination: `${host("payment-management", 8086)}/api/payment-methods/:path*`,
      },
      // Digital Marketing → 8087
      {
        source: "/api/campaigns/:path*",
        destination: `${host("digital-marketing", 8087)}/api/campaigns/:path*`,
      },
      // Supplier Management → 8088
      {
        source: "/api/v1/suppliers/:path*",
        destination: `${host("supplier-management", 8088)}/api/v1/suppliers/:path*`,
      },
      {
        source: "/api/v1/supplier-products/:path*",
        destination: `${host("supplier-management", 8088)}/api/v1/products/:path*`,
      },
      // Installation Management → 8089
      {
        source: "/api/installations/:path*",
        destination: `${host("installation-management", 8089)}/api/installations/:path*`,
      },
      {
        source: "/api/technicians/:path*",
        destination: `${host("installation-management", 8089)}/api/technicians/:path*`,
      },
    ];
  },
};

export default nextConfig;
