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
  getByDateRange: async (startDate: string, endDate: string): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/date-range?startDate=${startDate}&endDate=${endDate}`);
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
  updateStatus: async (orderId: number, request: UpdateOrderStatusRequest): Promise<ApiSuccessResponse> => {
    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiSuccessResponse>(res);
  },

  // Cancel order
  cancel: async (orderId: number, request?: CancelOrderRequest): Promise<ApiSuccessResponse> => {
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
  health: async (): Promise<{ status: string; service: string; timestamp: string }> => {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse<{ status: string; service: string; timestamp: string }>(res);
  },
};
