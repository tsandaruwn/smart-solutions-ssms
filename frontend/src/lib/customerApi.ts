// ====================================
// CUSTOMER MANAGEMENT API
// Purpose: API utilities for customer management operations
// Base URL: http://localhost:8081/api/v1/customers
// ====================================

import type { 
  Customer, 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerApiResponse,
  PageResponse 
} from "@/types/customer";

const BASE_URL = "http://localhost:8081/api/v1/customers";

class CustomerManagementAPI {
  // ============ CUSTOMER ENDPOINTS ============
  
  /**
   * Get all customers with pagination and search support
   */
  async getAllCustomers(
    page: number = 0,
    size: number = 100,
    sortBy: string = "customerId",
    direction: string = "asc",
    search?: string
  ): Promise<Customer[]> {
    let url = `${BASE_URL}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch customers");
    const result: CustomerApiResponse<PageResponse<Customer>> = await response.json();
    return result.data.content;
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: number): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch customer ${id}`);
    const result: CustomerApiResponse<Customer> = await response.json();
    return result.data;
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/email/${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error(`Failed to fetch customer with email ${email}`);
    const result: CustomerApiResponse<Customer> = await response.json();
    return result.data;
  }

  /**
   * Create a new customer
   */
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create customer");
    }
    const result: CustomerApiResponse<Customer> = await response.json();
    return result.data;
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(id: number, customerData: UpdateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update customer");
    }
    const result: CustomerApiResponse<Customer> = await response.json();
    return result.data;
  }

  /**
   * Delete a customer (soft delete)
   */
  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete customer");
  }

  /**
   * Get customer order history
   */
  async getCustomerOrderHistory(id: number): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/${id}/orders`);
    if (!response.ok) throw new Error("Failed to fetch customer order history");
    const result: CustomerApiResponse<any[]> = await response.json();
    return result.data;
  }

  /**
   * Search customers by name or email
   */
  async searchCustomers(searchTerm: string, page: number = 0, size: number = 100): Promise<Customer[]> {
    return this.getAllCustomers(page, size, "customerId", "asc", searchTerm);
  }
}

export const customerApi = new CustomerManagementAPI();
