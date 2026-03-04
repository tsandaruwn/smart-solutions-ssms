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
