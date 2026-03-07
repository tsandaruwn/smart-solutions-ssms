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
  
  getAll: async (): Promise<OrderResponse[]> => {
    const res = await fetch(BASE_URL);
    return handleResponse<OrderResponse[]>(res);
  },

  getById: async (orderId: number): Promise<OrderResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}`);
    return handleResponse<OrderResponse>(res);
  },

  getByOrderNumber: async (orderNumber: string): Promise<OrderResponse> => {
    const res = await fetch(`${BASE_URL}/number/${orderNumber}`);
    return handleResponse<OrderResponse>(res);
  },

  getByCustomer: async (customerId: number): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/customer/${customerId}/history`);
    return handleResponse<OrderResponse[]>(res);
  },

  getByStatus: async (status: OrderStatus): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/status/${status}`);
    return handleResponse<OrderResponse[]>(res);
  },

  getByDateRange: async (
    startDate: string,
    endDate: string,
  ): Promise<OrderResponse[]> => {
    const res = await fetch(
      `${BASE_URL}/date-range?startDate=${startDate}&endDate=${endDate}`,
    );
    return handleResponse<OrderResponse[]>(res);
  },

  getRecent: async (): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/recent`);
    return handleResponse<OrderResponse[]>(res);
  },

  create: async (order: CreateOrderRequest): Promise<ApiSuccessResponse> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  update: async (orderId: number, order: CreateOrderRequest): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

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

  delete: async (orderId: number): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}`, {
      method: "DELETE",
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

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

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface BillDto {
  billId: number;
  customerId: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: string;
}

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
  
  generateInvoice: async (orderId: number): Promise<BillDto> => {
    const res = await fetch(`${BILLING_BASE}/orders/${orderId}`, {
      method: "POST",
    });
    return handleResponse<BillDto>(res);
  },

  getById: async (invoiceId: number): Promise<Bill> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}`);
    return handleResponse<Bill>(res);
  },

  getByCustomer: async (customerId: number): Promise<Bill[]> => {
    const res = await fetch(`${BILLING_BASE}/customers/${customerId}`);
    return handleResponse<Bill[]>(res);
  },

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

  delete: async (invoiceId: number): Promise<void> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  getCustomer: async (invoiceId: number): Promise<BillingCustomerDto> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}/customer`);
    return handleResponse<BillingCustomerDto>(res);
  },

  getPayments: async (invoiceId: number): Promise<BillingPaymentDto[]> => {
    const res = await fetch(`${BILLING_BASE}/invoices/${invoiceId}/payments`);
    return handleResponse<BillingPaymentDto[]>(res);
  },

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
  
  create: async (payment: PaymentRequest): Promise<PaymentResponse> => {
    const res = await fetch(PAYMENT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    return handleResponse<PaymentResponse>(res);
  },

  getAll: async (): Promise<PaymentResponse[]> => {
    const res = await fetch(PAYMENT_BASE);
    return handleResponse<PaymentResponse[]>(res);
  },

  getById: async (id: number): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`);
    return handleResponse<PaymentResponse>(res);
  },

  getByTransactionReference: async (transactionReference: string): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/transaction/${transactionReference}`);
    return handleResponse<PaymentResponse>(res);
  },

  getByCustomerId: async (customerId: number): Promise<PaymentResponse[]> => {
    const res = await fetch(`${PAYMENT_BASE}/customer/${customerId}`);
    return handleResponse<PaymentResponse[]>(res);
  },

  getByInvoiceId: async (invoiceId: number): Promise<PaymentResponse[]> => {
    const res = await fetch(`${PAYMENT_BASE}/invoice/${invoiceId}`);
    return handleResponse<PaymentResponse[]>(res);
  },

  update: async (id: number, payment: PaymentRequest): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    return handleResponse<PaymentResponse>(res);
  },

  updateStatus: async (id: number, status: PaymentTransactionStatus): Promise<PaymentResponse> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    return handleResponse<PaymentResponse>(res);
  },

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

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${PAYMENT_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

export const paymentMethodApi = {
  
  create: async (method: PaymentMethodRequest): Promise<PaymentMethodResponse> => {
    const res = await fetch(PAYMENT_METHOD_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method),
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  getAll: async (): Promise<PaymentMethodResponse[]> => {
    const res = await fetch(PAYMENT_METHOD_BASE);
    return handleResponse<PaymentMethodResponse[]>(res);
  },

  getActive: async (): Promise<PaymentMethodResponse[]> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/active`);
    return handleResponse<PaymentMethodResponse[]>(res);
  },

  getById: async (id: number): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`);
    return handleResponse<PaymentMethodResponse>(res);
  },

  getByName: async (methodName: string): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/name/${methodName}`);
    return handleResponse<PaymentMethodResponse>(res);
  },

  update: async (id: number, method: PaymentMethodRequest): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method),
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  toggleStatus: async (id: number): Promise<PaymentMethodResponse> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}/toggle-status`, {
      method: "PATCH",
    });
    return handleResponse<PaymentMethodResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${PAYMENT_METHOD_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

const INVENTORY_BASE = "/api/v1/inventory";
const WAREHOUSE_BASE = "/api/v1/warehouses";

export interface InventoryApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

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
  
  create: async (req: InventoryRequest): Promise<InventoryResponse> => {
    const res = await fetch(INVENTORY_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  getAll: async (): Promise<InventoryResponse[]> => {
    const res = await fetch(INVENTORY_BASE);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  getById: async (id: number): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`);
    return handleInventoryResponse<InventoryResponse>(res);
  },

  getByProduct: async (productId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/product/${productId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  getByWarehouse: async (warehouseId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/warehouse/${warehouseId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  update: async (id: number, req: InventoryRequest): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  updateStock: async (id: number, req: StockUpdateRequest): Promise<InventoryResponse> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<InventoryResponse>(res);
  },

  getLowStockAlerts: async (): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/alerts/low-stock`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  getLowStockByWarehouse: async (warehouseId: number): Promise<InventoryResponse[]> => {
    const res = await fetch(`${INVENTORY_BASE}/alerts/low-stock/warehouse/${warehouseId}`);
    return handleInventoryResponse<InventoryResponse[]>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${INVENTORY_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

export const warehouseApi = {
  
  create: async (req: WarehouseRequest): Promise<WarehouseResponse> => {
    const res = await fetch(WAREHOUSE_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  getAll: async (): Promise<WarehouseResponse[]> => {
    const res = await fetch(WAREHOUSE_BASE);
    return handleInventoryResponse<WarehouseResponse[]>(res);
  },

  getById: async (id: number): Promise<WarehouseResponse> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`);
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  update: async (id: number, req: WarehouseRequest): Promise<WarehouseResponse> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleInventoryResponse<WarehouseResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${WAREHOUSE_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

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
  
  getAll: async (page = 0, size = 20, search?: string): Promise<{ content: CustomerResponse[]; totalElements: number; totalPages: number }> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append("search", search);
    const res = await fetch(`${CUSTOMER_BASE}?${params}`);
    return handleCustomerResponse(res);
  },

  getById: async (id: number): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`);
    return handleCustomerResponse<CustomerResponse>(res);
  },

  getByEmail: async (email: string): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/email/${email}`);
    return handleCustomerResponse<CustomerResponse>(res);
  },

  create: async (data: CustomerRequest): Promise<CustomerResponse> => {
    const res = await fetch(CUSTOMER_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleCustomerResponse<CustomerResponse>(res);
  },

  update: async (id: number, data: CustomerUpdateRequest): Promise<CustomerResponse> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleCustomerResponse<CustomerResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${CUSTOMER_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

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
  
  getAll: async (): Promise<SupplierResponse[]> => {
    const res = await fetch(SUPPLIER_BASE);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  getActive: async (): Promise<SupplierResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/active`);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  getById: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`);
    return handleSupplierResponse<SupplierResponse>(res);
  },

  create: async (data: SupplierRequest): Promise<SupplierResponse> => {
    const res = await fetch(SUPPLIER_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  update: async (id: number, data: SupplierRequest): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  activate: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/activate`, { method: "PATCH" });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  deactivate: async (id: number): Promise<SupplierResponse> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/deactivate`, { method: "PATCH" });
    return handleSupplierResponse<SupplierResponse>(res);
  },

  search: async (companyName: string): Promise<SupplierResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/search?companyName=${encodeURIComponent(companyName)}`);
    return handleSupplierResponse<SupplierResponse[]>(res);
  },

  getProducts: async (id: number): Promise<SupplierProductResponse[]> => {
    const res = await fetch(`${SUPPLIER_BASE}/${id}/products`);
    return handleSupplierResponse<SupplierProductResponse[]>(res);
  },
};

export const supplierProductApi = {
  
  getAll: async (): Promise<SupplierProductResponse[]> => {
    const res = await fetch(SUPPLIER_PRODUCT_BASE);
    return handleSupplierResponse<SupplierProductResponse[]>(res);
  },

  create: async (data: SupplierProductRequest): Promise<SupplierProductResponse> => {
    const res = await fetch(SUPPLIER_PRODUCT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierProductResponse>(res);
  },

  update: async (id: number, data: SupplierProductRequest): Promise<SupplierProductResponse> => {
    const res = await fetch(`${SUPPLIER_PRODUCT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleSupplierResponse<SupplierProductResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${SUPPLIER_PRODUCT_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

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
  
  getAll: async (): Promise<InstallationResponse[]> => {
    const res = await fetch(INSTALLATION_BASE);
    return handleResponse<InstallationResponse[]>(res);
  },

  getById: async (id: number): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}`);
    return handleResponse<InstallationResponse>(res);
  },

  getByStatus: async (status: InstallationStatus): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/status/${status}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  getByTechnician: async (technicianId: number): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/technician/${technicianId}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  getByDateRange: async (start: string, end: string): Promise<InstallationResponse[]> => {
    const res = await fetch(`${INSTALLATION_BASE}/date-range?start=${start}&end=${end}`);
    return handleResponse<InstallationResponse[]>(res);
  },

  create: async (data: InstallationRequest): Promise<InstallationResponse> => {
    const res = await fetch(INSTALLATION_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  assignTechnician: async (id: number, data: TechnicianAssignment): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/assign-technician`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  updateStatus: async (id: number, data: StatusUpdate): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InstallationResponse>(res);
  },

  cancel: async (id: number): Promise<InstallationResponse> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}/cancel`, {
      method: "PATCH",
    });
    return handleResponse<InstallationResponse>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${INSTALLATION_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};

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
  
  getAll: async (): Promise<TechnicianResponse[]> => {
    const res = await fetch(TECHNICIAN_BASE);
    return handleResponse<TechnicianResponse[]>(res);
  },

  getActive: async (): Promise<TechnicianResponse[]> => {
    const res = await fetch(`${TECHNICIAN_BASE}/active`);
    return handleResponse<TechnicianResponse[]>(res);
  },

  getById: async (id: number): Promise<TechnicianResponse> => {
    const res = await fetch(`${TECHNICIAN_BASE}/${id}`);
    return handleResponse<TechnicianResponse>(res);
  },
};

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
  
  getAll: async (): Promise<CampaignResponse[]> => {
    const res = await fetch(CAMPAIGN_BASE);
    return handleResponse<CampaignResponse[]>(res);
  },

  getById: async (id: number): Promise<CampaignResponse> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`);
    return handleResponse<CampaignResponse>(res);
  },

  getByUser: async (userId: number): Promise<CampaignResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/user/${userId}`);
    return handleResponse<CampaignResponse[]>(res);
  },

  getByStatus: async (status: CampaignStatus): Promise<CampaignResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/status/${status}`);
    return handleResponse<CampaignResponse[]>(res);
  },

  create: async (data: CreateCampaignRequest): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(CAMPAIGN_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  update: async (id: number, data: UpdateCampaignRequest): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  updateStatus: async (id: number, status: CampaignStatus): Promise<{ success: boolean; campaign: CampaignResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    return handleResponse<{ success: boolean; campaign: CampaignResponse }>(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },

  addPerformance: async (campaignId: number, data: RecordPerformanceRequest): Promise<{ success: boolean; performance: PerformanceResponse }> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; performance: PerformanceResponse }>(res);
  },

  getPerformance: async (campaignId: number): Promise<PerformanceResponse[]> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance`);
    return handleResponse<PerformanceResponse[]>(res);
  },

  getPerformanceSummary: async (campaignId: number): Promise<CampaignSummary> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance/summary`);
    return handleResponse<CampaignSummary>(res);
  },

  deletePerformance: async (campaignId: number, perfId: number): Promise<void> => {
    const res = await fetch(`${CAMPAIGN_BASE}/${campaignId}/performance/${perfId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  },
};
