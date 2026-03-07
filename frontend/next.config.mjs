const nextConfig = {
  async rewrites() {
    const isDocker = process.env.DOCKER === "true";

    const host = (service, port) => {
      if (isDocker) return `http://${service}:${port}`;
      const envMap = {
        "user-management": process.env.USER_MANAGEMENT_URL,
        "customer-service": process.env.CUSTOMER_SERVICE_URL,
        "product-management": process.env.PRODUCT_MANAGEMENT_URL,
        "inventory-management": process.env.INVENTORY_MANAGEMENT_URL,
        "order-management": process.env.ORDER_MANAGEMENT_URL,
        "billing-and-invoice": process.env.BILLING_SERVICE_URL,
        "payment-management": process.env.PAYMENT_MANAGEMENT_URL,
        "digital-marketing": process.env.DIGITAL_MARKETING_URL,
        "supplier-management": process.env.SUPPLIER_MANAGEMENT_URL,
        "installation-management": process.env.INSTALLATION_MANAGEMENT_URL,
      };
      return envMap[service] || `http://localhost:${port}`;
    };

    return [
      
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
      
      {
        source: "/api/v1/customers/:path*",
        destination: `${host("customer-service", 8081)}/api/v1/customers/:path*`,
      },
      
      {
        source: "/api/products/:path*",
        destination: `${host("product-management", 8082)}/api/products/:path*`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${host("product-management", 8082)}/api/categories/:path*`,
      },
      
      {
        source: "/api/v1/inventory/:path*",
        destination: `${host("inventory-management", 8083)}/api/v1/inventory/:path*`,
      },
      {
        source: "/api/v1/warehouses/:path*",
        destination: `${host("inventory-management", 8083)}/api/v1/warehouses/:path*`,
      },
      
      {
        source: "/api/orders/:path*",
        destination: `${host("order-management", 8084)}/api/orders/:path*`,
      },
      
      {
        source: "/api/billing/:path*",
        destination: `${host("billing-and-invoice", 8085)}/api/billing/:path*`,
      },
      
      {
        source: "/api/payments/:path*",
        destination: `${host("payment-management", 8086)}/api/payments/:path*`,
      },
      {
        source: "/api/payment-methods/:path*",
        destination: `${host("payment-management", 8086)}/api/payment-methods/:path*`,
      },
      
      {
        source: "/api/campaigns/:path*",
        destination: `${host("digital-marketing", 8087)}/api/campaigns/:path*`,
      },
      
      {
        source: "/api/v1/suppliers/:path*",
        destination: `${host("supplier-management", 8088)}/api/v1/suppliers/:path*`,
      },
      {
        source: "/api/v1/supplier-products/:path*",
        destination: `${host("supplier-management", 8088)}/api/v1/products/:path*`,
      },
      
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
