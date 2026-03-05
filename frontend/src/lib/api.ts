// Order Management API Service
// Connects to the Spring Boot backend at localhost:8085 via Next.js rewrites

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  unitPriceAtOrder: number;
  discountPercent?: number;
}

export interface CreateOrderRequest {
  customerId: number;
  createdByUserId?: number;
  shippingAddress: string;
  shippingCity: string;
  notes?: string;
  items: OrderItemRequest[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CancelOrderRequest {
  cancellationReason?: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPriceAtOrder: number;
  discountPercent: number;
  lineTotal: number;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  customerId: number;
  createdByUserId: number;
  orderDate: string;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  totalAmount: number;
  notes: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  updatedAt: string | null;
  items: OrderItemResponse[];
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
  orderNumber?: string;
  order?: OrderResponse;
}

export interface ApiErrorResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
}

const BASE_URL = "/api/orders";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      status: response.status,
      message: response.statusText,
      timestamp: new Date().toISOString(),
    }));
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
}

export const orderApi = {
  // Get all orders
  getAll: async (): Promise<OrderResponse[]> => {
    const res = await fetch(BASE_URL);
    return handleResponse<OrderResponse[]>(res);
  },

  // Get order by ID
  getById: async (orderId: number): Promise<OrderResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}`);
    return handleResponse<OrderResponse>(res);
  },

  // Get order by order number
  getByOrderNumber: async (orderNumber: string): Promise<OrderResponse> => {
    const res = await fetch(`${BASE_URL}/number/${orderNumber}`);
    return handleResponse<OrderResponse>(res);
  },

  // Get orders by customer ID
  getByCustomer: async (customerId: number): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/customer/${customerId}/history`);
    return handleResponse<OrderResponse[]>(res);
  },

  // Get orders by status
  getByStatus: async (status: OrderStatus): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/status/${status}`);
    return handleResponse<OrderResponse[]>(res);
  },

  // Get orders in date range
  getByDateRange: async (
    startDate: string,
    endDate: string,
  ): Promise<OrderResponse[]> => {
    const res = await fetch(
      `${BASE_URL}/date-range?startDate=${startDate}&endDate=${endDate}`,
    );
    return handleResponse<OrderResponse[]>(res);
  },

  // Get recent orders
  getRecent: async (): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/recent`);
    return handleResponse<OrderResponse[]>(res);
  },

  // Create a new order
  create: async (order: CreateOrderRequest): Promise<ApiSuccessResponse> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  // Update order status
  updateStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest,
  ): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  // Cancel order
  cancel: async (
    orderId: number,
    request?: CancelOrderRequest,
  ): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request || {}),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  // Delete order
  delete: async (orderId: number): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}`, {
      method: "DELETE",
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  // Health check
  health: async (): Promise<{
    status: string;
    service: string;
    timestamp: string;
  }> => {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse<{
      status: string;
      service: string;
      timestamp: string;
    }>(res);
  },
};

// ---------------------------------------------------------------------------
// Billing & Invoice API
// Proxied to http://localhost:6543 via Next.js rewrite /api/billing → 6543
// ---------------------------------------------------------------------------

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface BillDto {
  billId: number;
  customerId: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: string;
}

/** Raw entity returned from GET /invoices/{id} and CRUD endpoints */
export interface Bill {
  id: number;
  orderId: number;
  customerId: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: string;
}

export interface BillingCustomerDto {
  customerId: number;
  name: string;
  email: string;
}

export interface BillingPaymentDto {
  paymentId: number;
  invoiceId: number;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
}

export interface RecordPaymentRequest {
  amount: number;
}

export interface UpdateBillRequest {
  subtotal?: number;
  tax?: number;
  totalAmount?: number;
  status?: string;
}

const BILLING_BASE = "/api/billing";

export const billingApi = {
  /** POST /api/billing/orders/{orderId} – generate an invoice for an order */
  generateInvoice: async (orderId: number): Promise<BillDto> => {
    const res = await fetch(`${BILLING_BASE}/orders/${orderId}`, {
      method: "POST",
    });
    return handleResponse<BillDto>(res);
  },

  /** GET /api/billing/invoices/{invoiceId} – fetch a single invoice */
  getById: async (invoiceId: number): Promise<Bill> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}`);
    return handleResponse<Bill>(res);
  },

  /** GET /api/billing/customers/{customerId} – list all invoices for a customer */
  getByCustomer: async (customerId: number): Promise<Bill[]> => {
    const res = await fetch(`${BILLING_BASE}/customers/${customerId}`);
    return handleResponse<Bill[]>(res);
  },

  /** PUT /api/billing/invoices/{invoiceId} – update an invoice */
  update: async (
    invoiceId: number,
    updates: UpdateBillRequest,
  ): Promise<Bill> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse<Bill>(res);
  },

  /** DELETE /api/billing/invoices/{invoiceId} – delete an invoice */
  delete: async (invoiceId: number): Promise<void> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  /** GET /api/billing/invoices/{invoiceId}/customer – customer info linked to invoice */
  getCustomer: async (invoiceId: number): Promise<BillingCustomerDto> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}/customer`);
    return handleResponse<BillingCustomerDto>(res);
  },

  /** GET /api/billing/invoices/{invoiceId}/payments – payments recorded on invoice */
  getPayments: async (invoiceId: number): Promise<BillingPaymentDto[]> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}/payments`);
    return handleResponse<BillingPaymentDto[]>(res);
  },

  /** POST /api/billing/invoices/{invoiceId}/payments – record a payment */
  addPayment: async (
    invoiceId: number,
    payment: RecordPaymentRequest,
  ): Promise<BillingPaymentDto> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    return handleResponse<BillingPaymentDto>(res);
  },
};

// ============================================
// Payment Management API Service
// ============================================

const PAYMENT_BASE = "/api/payments";
const PAYMENT_METHOD_BASE = "/api/payment-methods";

export type PaymentTransactionStatus = "Pending" | "Success" | "Failed";
export type PaymentMethodType = "Card" | "Bank_Transfer" | "Mobile_Wallet" | "Cash" | "Online_Banking";

export interface PaymentMethodResponse {
  paymentMethodId: number;
  methodName: string;
  type: PaymentMethodType;
  description: string | null;
  isActive: boolean;
}

export interface PaymentMethodRequest {
  methodName: string;
  type: PaymentMethodType;
  description?: string;
  isActive?: boolean;
}

export interface PaymentResponse {
  paymentId: number;
  transactionReference: string;
  invoiceId: number;
  customerId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  paymentDate: string;
  status: PaymentTransactionStatus;
  gatewayResponse: string | null;
  refundAmount: number | null;
  refundDate: string | null;
  refundReason: string | null;
}

export interface PaymentRequest {
  transactionReference?: string;
  invoiceId: number;
  customerId: number;
  amount: number;
  paymentMethodId: number;
  gatewayResponse?: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface ProcessRefundRequest {
  refundReason?: string;
  refundAmount?: number;
}

export const paymentApi = {
  /** POST /api/payments – create a new payment */
  create: async (payment: PaymentRequest): Promise<PaymentResponse> => {
    const res = await fetch(PAYMENT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    return handleResponse<PaymentResponse>(res);
  },

  /** GET /api/payments – get all payments */
  getAll: async (): Promise<PaymentResponse[]> => {
    const res = await fetch(PAYMENT_BASE);
    return handleResponse<PaymentResponse[]>(res);
  },

  /** GET /api/payments/{id} – get payment by ID */
  getById: async (id: number): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`);
    return handleResponse<PaymentResponse>(res);
  },

  /** GET /api/payments/transaction/{transactionReference} – get payment by transaction reference */
  getByTransactionReference: async (transactionReference: string): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/transaction/${transactionReference}`);
    return handleResponse<PaymentResponse>(res);
  },

  /** GET /api/payments/customer/{customerId} – get payment history by customer */
  getByCustomerId: async (customerId: number): Promise<PaymentResponse[]> => {
    const res = await fetch(`${PAYMENT_BASE}/customer/${customerId}`);
    return handleResponse<PaymentResponse[]>(res);
  },

  /** GET /api/payments/invoice/{invoiceId} – get payments by invoice */
  getByInvoiceId: async (invoiceId: number): Promise<PaymentResponse[]> => {
    const res = await fetch(`${PAYMENT_BASE}/invoice/${invoiceId}`);
    return handleResponse<PaymentResponse[]>(res);
  },

  /** PUT /api/payments/{id} – update payment */
  update: async (id: number, payment: PaymentRequest): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    return handleResponse<PaymentResponse>(res);
  },

  /** PATCH /api/payments/{id}/status – update payment status */
  updateStatus: async (id: number, status: PaymentTransactionStatus): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    return handleResponse<PaymentResponse>(res);
  },

  /** POST /api/payments/{id}/refund – process refund */
  processRefund: async (
    id: number, 
    refundReason?: string, 
    refundAmount?: number
  ): Promise<PaymentResponse> => {
    const params = new URLSearchParams();
    if (refundReason) params.append("refundReason", refundReason);
    if (refundAmount !== undefined) params.append("refundAmount", refundAmount.toString());
    
    const url = `${PAYMENT_BASE}/${id}/refund${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { method: "POST" });
    return handleResponse<PaymentResponse>(res);
  },

  /** DELETE /api/payments/{id} – delete payment */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

export const paymentMethodApi = {
  /** POST /api/payment-methods – create a new payment method */
  create: async (method: PaymentMethodRequest): Promise<PaymentMethodResponse> => {
    const res = await fetch(PAYMENT_METHOD_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method),
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  /** GET /api/payment-methods – get all payment methods */
  getAll: async (): Promise<PaymentMethodResponse[]> => {
    const res = await fetch(PAYMENT_METHOD_BASE);
    return handleResponse<PaymentMethodResponse[]>(res);
  },

  /** GET /api/payment-methods/active – get active payment methods */
  getActive: async (): Promise<PaymentMethodResponse[]> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/active`);
    return handleResponse<PaymentMethodResponse[]>(res);
  },

  /** GET /api/payment-methods/{id} – get payment method by ID */
  getById: async (id: number): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`);
    return handleResponse<PaymentMethodResponse>(res);
  },

  /** GET /api/payment-methods/name/{methodName} – get payment method by name */
  getByName: async (methodName: string): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/name/${methodName}`);
    return handleResponse<PaymentMethodResponse>(res);
  },

  /** PUT /api/payment-methods/{id} – update payment method */
  update: async (id: number, method: PaymentMethodRequest): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method),
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  /** PATCH /api/payment-methods/{id}/toggle-status – toggle payment method active status */
  toggleStatus: async (id: number): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}/toggle-status`, {
      method: "PATCH",
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  /** DELETE /api/payment-methods/{id} – delete payment method */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Inventory Management API Service
// Proxied to http://localhost:8084 via Next.js rewrite
// ============================================

const INVENTORY_BASE = "/api/v1/inventory";
const WAREHOUSE_BASE = "/api/v1/warehouses";

// -- Envelope used by inventory service --
export interface InventoryApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

// -- Warehouse --

export interface WarehouseResponse {
  warehouseId: number;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  managerUserId: number | null;
  contactPhone: string | null;
  capacity: number | null;
  isActive: boolean;
}

export interface WarehouseRequest {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  managerUserId?: number;
  contactPhone?: string;
  capacity?: number;
  isActive?: boolean;
}

// -- Inventory --

export interface InventoryResponse {
  inventoryId: number;
  productId: number;
  warehouse: WarehouseResponse;
  quantityOnHand: number;
  reorderLevel: number;
  reorderQuantity: number;
  lowStockAlertSent: boolean;
  lowStock: boolean;
  lastRestockedAt: string | null;
  updatedAt: string | null;
}

export interface InventoryRequest {
  productId: number;
  warehouseId: number;
  quantityOnHand: number;
  reorderLevel?: number;
  reorderQuantity?: number;
}

export type StockOperation = "INCREASE" | "DECREASE" | "SET";

export interface StockUpdateRequest {
  quantity: number;
  operation: StockOperation;
  reason?: string;
}

/** Helper to unwrap the ApiResponse<T> envelope from the inventory service */
async function handleInventoryResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({
      success: false,
      message: response.statusText,
    }));
    throw new Error(body.message || "An error occurred");
  }
  const envelope: InventoryApiResponse<T> = await response.json();
  if (!envelope.success) {
    throw new Error(envelope.message || "An error occurred");
  }
  return envelope.data as T;
}

export const inventoryApi = {
  /** POST /api/v1/inventory – create inventory record */
  create: async (req: InventoryRequest): Promise<InventoryResponse> => {
    const res = await fetch(INVENTORY_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  /** GET /api/v1/inventory – get all inventory records */
  getAll: async (): Promise<InventoryResponse[]> => {
    const res = await fetch(INVENTORY_BASE);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  /** GET /api/v1/inventory/{id} – get by ID */
  getById: async (id: number): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`);
    return handleInventoryResponse<InventoryResponse>(res);
  },

  /** GET /api/v1/inventory/product/{productId} – get by product */
  getByProduct: async (productId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/product/${productId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  /** GET /api/v1/inventory/warehouse/{warehouseId} – get by warehouse */
  getByWarehouse: async (warehouseId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/warehouse/${warehouseId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  /** PUT /api/v1/inventory/{id} – update inventory */
  update: async (id: number, req: InventoryRequest): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  /** PATCH /api/v1/inventory/{id}/stock – update stock */
  updateStock: async (id: number, req: StockUpdateRequest): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  /** GET /api/v1/inventory/alerts/low-stock – all low-stock alerts */
  getLowStockAlerts: async (): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/alerts/low-stock`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  /** GET /api/v1/inventory/alerts/low-stock/warehouse/{warehouseId} */
  getLowStockByWarehouse: async (warehouseId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/alerts/low-stock/warehouse/${warehouseId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  /** DELETE /api/v1/inventory/{id} – soft-delete */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

export const warehouseApi = {
  /** POST /api/v1/warehouses – create warehouse */
  create: async (req: WarehouseRequest): Promise<WarehouseResponse> => {
    const res = await fetch(WAREHOUSE_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  /** GET /api/v1/warehouses – get all active warehouses */
  getAll: async (): Promise<WarehouseResponse[]> => {
    const res = await fetch(WAREHOUSE_BASE);
    return handleInventoryResponse<WarehouseResponse[]>(res);
  },

  /** GET /api/v1/warehouses/{id} – get by ID */
  getById: async (id: number): Promise<WarehouseResponse> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`);
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  /** PUT /api/v1/warehouses/{id} – update warehouse */
  update: async (id: number, req: WarehouseRequest): Promise<WarehouseResponse> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  /** DELETE /api/v1/warehouses/{id} – soft-deactivate */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Product Management API Service
// Proxied to http://localhost:8080 via Next.js rewrite
// ============================================

const PRODUCT_BASE = "/api/products";
const CATEGORY_BASE = "/api/categories";

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface ProductResponse {
  id: number;
  sku: string;
  name: string;
  categoryId: number;
  categoryName?: string;
  supplierId: number;
  price: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  discontinuedAt?: string;
}

export interface ProductRequest {
  sku: string;
  name: string;
  categoryId: number;
  supplierId: number;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export const categoryApi = {
  getAll: async (): Promise<ProductCategory[]> => {
    const res = await fetch(CATEGORY_BASE);
    return handleResponse<ProductCategory[]>(res);
  },

  create: async (data: CategoryRequest): Promise<ProductCategory> => {
    const res = await fetch(CATEGORY_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ProductCategory>(res);
  },
};

export const productApi = {
  getAll: async (): Promise<ProductResponse[]> => {
    const res = await fetch(PRODUCT_BASE);
    return handleResponse<ProductResponse[]>(res);
  },

  getAvailable: async (): Promise<ProductResponse[]> => {
    const res = await fetch(`${PRODUCT_BASE}/available`);
    return handleResponse<ProductResponse[]>(res);
  },

  getById: async (id: number): Promise<ProductResponse> => {
    const res = await fetch(`${PRODUCT_BASE}/${id}`);
    return handleResponse<ProductResponse>(res);
  },

  create: async (data: ProductRequest): Promise<ProductResponse> => {
    const res = await fetch(PRODUCT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ProductResponse>(res);
  },

  update: async (id: number, data: ProductRequest): Promise<ProductResponse> => {
    const res = await fetch(`${PRODUCT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ProductResponse>(res);
  },

  discontinue: async (id: number): Promise<ProductResponse> => {
    const res = await fetch(`${PRODUCT_BASE}/${id}/discontinue`, {
      method: "PATCH",
    });
    return handleResponse<ProductResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${PRODUCT_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Customer Service API
// Proxied to http://localhost:8082 via Next.js rewrite
// ============================================

const CUSTOMER_BASE = "/api/v1/customers";

export interface CustomerResponse {
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  dateOfBirth: string | null;
  registrationDate: string;
}

export interface CustomerRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
}

export interface CustomerUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
}

interface CustomerApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function handleCustomerResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({
      success: false,
      message: response.statusText,
    }));
    throw new Error(body.message || "An error occurred");
  }
  const envelope: CustomerApiResponse<T> = await response.json();
  if (!envelope.success) {
    throw new Error(envelope.message || "An error occurred");
  }
  return envelope.data;
}

export const customerApi = {
  /** GET /api/v1/customers – list customers (paginated) */
  getAll: async (page = 0, size = 20, search?: string): Promise<{ content: CustomerResponse[]; totalElements: number; totalPages: number }> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append("search", search);
    const res = await fetch(`${CUSTOMER_BASE}?${params}`);
    return handleCustomerResponse(res);
  },

  /** GET /api/v1/customers/{id} */
  getById: async (id: number): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`);
    return handleCustomerResponse<CustomerResponse>(res);
  },

  /** GET /api/v1/customers/email/{email} */
  getByEmail: async (email: string): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/email/${email}`);
    return handleCustomerResponse<CustomerResponse>(res);
  },

  /** POST /api/v1/customers */
  create: async (data: CustomerRequest): Promise<CustomerResponse> => {
    const res = await fetch(CUSTOMER_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleCustomerResponse<CustomerResponse>(res);
  },

  /** PUT /api/v1/customers/{id} */
  update: async (id: number, data: CustomerUpdateRequest): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleCustomerResponse<CustomerResponse>(res);
  },

  /** DELETE /api/v1/customers/{id} */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Supplier Management API
// Proxied to http://localhost:8087 via Next.js rewrite
// ============================================

const SUPPLIER_BASE = "/api/v1/suppliers";
const SUPPLIER_PRODUCT_BASE = "/api/v1/supplier-products";

export interface SupplierResponse {
  supplierId: number;
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  isActive: boolean;
  createdAt: string;
  products: SupplierProductResponse[];
}

export interface SupplierRequest {
  email: string;
  companyName: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  isActive?: boolean;
}

export interface SupplierProductResponse {
  productId: number;
  productName: string;
  description: string | null;
  unitPrice: number;
  quantityInStock: number;
  supplierId: number;
  supplierName: string;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierProductRequest {
  productName: string;
  description?: string;
  unitPrice: number;
  quantityInStock: number;
  supplierId: number;
  isActive?: boolean;
}

interface SupplierApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function handleSupplierResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({
      success: false,
      message: response.statusText,
    }));
    throw new Error(body.message || "An error occurred");
  }
  const envelope: SupplierApiResponse<T> = await response.json();
  if (!envelope.success) {
    throw new Error(envelope.message || "An error occurred");
  }
  return envelope.data;
}

export const supplierApi = {
  /** GET /api/v1/suppliers – get all suppliers */
  getAll: async (): Promise<SupplierResponse[]> => {
    const res = await fetch(SUPPLIER_BASE);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  /** GET /api/v1/suppliers/active */
  getActive: async (): Promise<SupplierResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/active`);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  /** GET /api/v1/suppliers/{id} */
  getById: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`);
    return handleSupplierResponse<SupplierResponse>(res);
  },

  /** POST /api/v1/suppliers */
  create: async (data: SupplierRequest): Promise<SupplierResponse> => {
    const res = await fetch(SUPPLIER_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  /** PUT /api/v1/suppliers/{id} */
  update: async (id: number, data: SupplierRequest): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  /** DELETE /api/v1/suppliers/{id} – soft delete */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  /** PATCH /api/v1/suppliers/{id}/activate */
  activate: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/activate`, { method: "PATCH" });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  /** PATCH /api/v1/suppliers/{id}/deactivate */
  deactivate: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/deactivate`, { method: "PATCH" });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  /** GET /api/v1/suppliers/search?companyName= */
  search: async (companyName: string): Promise<SupplierResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/search?companyName=${encodeURIComponent(companyName)}`);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  /** GET /api/v1/suppliers/{id}/products */
  getProducts: async (id: number): Promise<SupplierProductResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/products`);
    return handleSupplierResponse<SupplierProductResponse[]>(res);
  },
};

export const supplierProductApi = {
  /** GET /api/v1/supplier-products – all products */
  getAll: async (): Promise<SupplierProductResponse[]> => {
    const res = await fetch(SUPPLIER_PRODUCT_BASE);
    return handleSupplierResponse<SupplierProductResponse[]>(res);
  },

  /** POST /api/v1/supplier-products */
  create: async (data: SupplierProductRequest): Promise<SupplierProductResponse> => {
    const res = await fetch(SUPPLIER_PRODUCT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierProductResponse>(res);
  },

  /** PUT /api/v1/supplier-products/{id} */
  update: async (id: number, data: SupplierProductRequest): Promise<SupplierProductResponse> => {
    const res = await fetch(`${SUPPLIER_PRODUCT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierProductResponse>(res);
  },

  /** DELETE /api/v1/supplier-products/{id} */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${SUPPLIER_PRODUCT_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Installation Management API
// Proxied to http://localhost:8083 via Next.js rewrite
// ============================================

const INSTALLATION_BASE = "/api/installations";

export type InstallationStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface InstallationResponse {
  id: number;
  jobReference: string;
  orderId: number;
  customerId: number;
  technicianId: number;
  scheduledByUserId: number | null;
  scheduledDate: string;
  completedDate: string | null;
  installationAddress: string;
  status: InstallationStatus;
  technicianNotes: string | null;
  cancellationReason: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InstallationRequest {
  jobReference: string;
  orderId: number;
  customerId: number;
  technicianId: number;
  scheduledByUserId?: number;
  scheduledDate: string;
  installationAddress: string;
  status: InstallationStatus;
  technicianNotes?: string;
}

export interface TechnicianAssignment {
  technicianId: number;
  technicianName: string;
}

export interface StatusUpdate {
  status: InstallationStatus;
  notes?: string;
}

export const installationApi = {
  /** GET /api/installations – get all */
  getAll: async (): Promise<InstallationResponse[]> => {
    const res = await fetch(INSTALLATION_BASE);
    return handleResponse<InstallationResponse[]>(res);
  },

  /** GET /api/installations/{id} */
  getById: async (id: number): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}`);
    return handleResponse<InstallationResponse>(res);
  },

  /** GET /api/installations/status/{status} */
  getByStatus: async (status: InstallationStatus): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/status/${status}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  /** GET /api/installations/technician/{technicianId} */
  getByTechnician: async (technicianId: number): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/technician/${technicianId}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  /** GET /api/installations/date-range?start=&end= */
  getByDateRange: async (start: string, end: string): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/date-range?start=${start}&end=${end}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  /** POST /api/installations */
  create: async (data: InstallationRequest): Promise<InstallationResponse> => {
    const res = await fetch(INSTALLATION_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  /** PUT /api/installations/{id}/assign-technician */
  assignTechnician: async (id: number, data: TechnicianAssignment): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/assign-technician`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  /** PATCH /api/installations/{id}/status */
  updateStatus: async (id: number, data: StatusUpdate): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  /** PATCH /api/installations/{id}/cancel */
  cancel: async (id: number): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/cancel`, {
      method: "PATCH",
    });
    return handleResponse<InstallationResponse>(res);
  },

  /** DELETE /api/installations/{id} */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

// ============================================
// Technician API (part of Installation Management)
// ============================================

const TECHNICIAN_BASE = "/api/technicians";

export type AvailabilityStatus = "AVAILABLE" | "ON_JOB" | "ON_LEAVE" | "UNAVAILABLE";

export interface TechnicianResponse {
  id: number;
  userId: number;
  specialization: string;
  certificationNumber: string;
  availabilityStatus: AvailabilityStatus;
  phone: string | null;
  hiredDate: string;
  isActive: boolean;
  createdAt: string;
}

export const technicianApi = {
  /** GET /api/technicians – all technicians */
  getAll: async (): Promise<TechnicianResponse[]> => {
    const res = await fetch(TECHNICIAN_BASE);
    return handleResponse<TechnicianResponse[]>(res);
  },

  /** GET /api/technicians/active – active technicians only */
  getActive: async (): Promise<TechnicianResponse[]> => {
    const res = await fetch(`${TECHNICIAN_BASE}/active`);
    return handleResponse<TechnicianResponse[]>(res);
  },

  /** GET /api/technicians/{id} */
  getById: async (id: number): Promise<TechnicianResponse> => {
    const res = await fetch(`${TECHNICIAN_BASE}/${id}`);
    return handleResponse<TechnicianResponse>(res);
  },
};

// ============================================
// Digital Marketing / Campaign API
// Proxied to http://localhost:8089 via Next.js rewrite
// ============================================

const CAMPAIGN_BASE = "/api/campaigns";

export type CampaignType = "EMAIL" | "SOCIAL_MEDIA" | "SEO" | "PPC" | "CONTENT" | "INFLUENCER" | "AFFILIATE" | "OTHER";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface CampaignResponse {
  campaignId: number;
  createdByUserId: number;
  name: string;
  type: CampaignType;
  description: string | null;
  targetAudience: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCampaignRequest {
  createdByUserId: number;
  name: string;
  type?: CampaignType;
  description?: string;
  targetAudience?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status?: CampaignStatus;
}

export interface UpdateCampaignRequest {
  name?: string;
  type?: CampaignType;
  description?: string;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: CampaignStatus;
}

export interface PerformanceResponse {
  perfId: number;
  campaignId: number;
  campaignName: string;
  recordedDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  costIncurred: number;
  clickThroughRate: number;
  conversionRate: number;
  roas: number;
}

export interface RecordPerformanceRequest {
  recordedDate: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenueGenerated?: number;
  costIncurred?: number;
}

export interface CampaignSummary {
  campaignId: number;
  campaignName: string;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCost: number;
  clickThroughRate: string;
  conversionRate: string;
  roas: string;
}

export const campaignApi = {
  /** GET /api/campaigns – get all */
  getAll: async (): Promise<CampaignResponse[]> => {
    const res = await fetch(CAMPAIGN_BASE);
    return handleResponse<CampaignResponse[]>(res);
  },

  /** GET /api/campaigns/{id} */
  getById: async (id: number): Promise<CampaignResponse> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`);
    return handleResponse<CampaignResponse>(res);
  },

  /** GET /api/campaigns/user/{userId} */
  getByUser: async (userId: number): Promise<CampaignResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/user/${userId}`);
    return handleResponse<CampaignResponse[]>(res);
  },

  /** GET /api/campaigns/status/{status} */
  getByStatus: async (status: CampaignStatus): Promise<CampaignResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/status/${status}`);
    return handleResponse<CampaignResponse[]>(res);
  },

  /** POST /api/campaigns */
  create: async (data: CreateCampaignRequest): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(CAMPAIGN_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  /** PUT /api/campaigns/{id} */
  update: async (id: number, data: UpdateCampaignRequest): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  /** PATCH /api/campaigns/{id}/status?status= */
  updateStatus: async (id: number, status: CampaignStatus): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  /** DELETE /api/campaigns/{id} */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  /** POST /api/campaigns/{id}/performance – add performance data */
  addPerformance: async (campaignId: number, data: RecordPerformanceRequest): Promise<{ success: boolean; performance: PerformanceResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; performance: PerformanceResponse }>(res);
  },

  /** GET /api/campaigns/{id}/performance */
  getPerformance: async (campaignId: number): Promise<PerformanceResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance`);
    return handleResponse<PerformanceResponse[]>(res);
  },

  /** GET /api/campaigns/{id}/performance/summary */
  getPerformanceSummary: async (campaignId: number): Promise<CampaignSummary> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance/summary`);
    return handleResponse<CampaignSummary>(res);
  },

  /** DELETE /api/campaigns/{id}/performance/{perfId} */
  deletePerformance: async (campaignId: number, perfId: number): Promise<void> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance/${perfId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};
