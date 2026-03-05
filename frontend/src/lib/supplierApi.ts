// ====================================
// SUPPLIER MANAGEMENT API SERVICE
// Purpose: API utilities for supplier and product management operations
// Backend Base URL: http://localhost:8085/api/v1
// API Documentation: Comprehensive CRUD operations with soft delete support
// ====================================

import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ApiResponse,
  ApiErrorResponse,
} from "@/types/supplier";

// Backend configuration
const BASE_URL = "http://localhost:8085/api/v1";

/**
 * Supplier Management API Client
 * Provides methods for all supplier and product operations
 * Includes error handling and response parsing
 */
class SupplierManagementAPI {
  // ============================================================
  // SUPPLIER ENDPOINTS
  // ============================================================

  /**
   * Get All Suppliers
   * Retrieves all suppliers including soft-deleted ones
   * @returns Promise<Supplier[]> Array of all suppliers
   */
  async getAllSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${BASE_URL}/suppliers`);
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    const result: ApiResponse<Supplier[]> = await response.json();
    return result.data;
  }

  /**
   * Get Active Suppliers Only
   * Retrieves only suppliers with isActive = true
   * Use this for dropdowns and active supplier listings
   * @returns Promise<Supplier[]> Array of active suppliers
   */
  async getActiveSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${BASE_URL}/suppliers/active`);
    if (!response.ok) throw new Error("Failed to fetch active suppliers");
    const result: ApiResponse<Supplier[]> = await response.json();
    return result.data;
  }

  /**
   * Get Supplier by ID
   * Retrieves a single supplier by their unique ID
   * @param id - Supplier ID
   * @returns Promise<Supplier> Supplier object with details
   * @throws Error if supplier not found (404)
   */
  async getSupplierById(id: number): Promise<Supplier> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      throw new Error("Failed to fetch supplier");
    }
    const result: ApiResponse<Supplier> = await response.json();
    return result.data;
  }

  /**
   * Create New Supplier
   * Creates a new supplier in the system
   * @param supplierData - Supplier information
   * @returns Promise<Supplier> Created supplier with generated ID
   * @throws Error if email already exists (409) or validation fails (400)
   */
  async createSupplier(
    supplierData: CreateSupplierRequest
  ): Promise<Supplier> {
    const response = await fetch(`${BASE_URL}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      if (response.status === 409) {
        throw new Error("Email already exists");
      }
      if (response.status === 400 && error.errors) {
        throw new Error(error.errors.join(", "));
      }
      throw new Error(error.message || "Failed to create supplier");
    }

    const result: ApiResponse<Supplier> = await response.json();
    return result.data;
  }

  /**
   * Update Existing Supplier
   * Updates an existing supplier's information
   * @param id - Supplier ID to update
   * @param supplierData - Updated supplier information
   * @returns Promise<Supplier> Updated supplier
   * @throws Error if supplier not found (404) or validation fails (400)
   */
  async updateSupplier(
    id: number,
    supplierData: UpdateSupplierRequest
  ): Promise<Supplier> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      if (response.status === 404) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      if (response.status === 400 && error.errors) {
        throw new Error(error.errors.join(", "));
      }
      throw new Error(error.message || "Failed to update supplier");
    }

    const result: ApiResponse<Supplier> = await response.json();
    return result.data;
  }

  /**
   * Soft Delete Supplier
   * Marks supplier as deleted but preserves data in database
   * Sets deletedAt timestamp
   * @param id - Supplier ID to delete
   * @returns Promise<void>
   * @throws Error if supplier not found (404)
   */
  async deleteSupplier(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      throw new Error("Failed to delete supplier");
    }
  }

  /**
   * Hard Delete Supplier (Permanent)
   * PERMANENTLY removes supplier from database
   * ⚠️ WARNING: This action cannot be undone!
   * @param id - Supplier ID to permanently delete
   * @returns Promise<void>
   * @throws Error if supplier not found (404)
   */
  async hardDeleteSupplier(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}/hard`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      throw new Error("Failed to permanently delete supplier");
    }
  }

  /**
   * Search Suppliers by Company Name
   * Performs case-insensitive partial match search
   * @param companyName - Search term
   * @returns Promise<Supplier[]> Array of matching suppliers
   */
  async searchSuppliers(companyName: string): Promise<Supplier[]> {
    const encodedSearch = encodeURIComponent(companyName);
    const response = await fetch(
      `${BASE_URL}/suppliers/search?companyName=${encodedSearch}`
    );
    if (!response.ok) throw new Error("Failed to search suppliers");
    const result: ApiResponse<Supplier[]> = await response.json();
    return result.data;
  }

  /**
   * Filter Suppliers by City
   * Gets all suppliers in a specific city
   * @param city - City name
   * @returns Promise<Supplier[]> Array of suppliers in the city
   */
  async getSuppliersByCity(city: string): Promise<Supplier[]> {
    const encodedCity = encodeURIComponent(city);
    const response = await fetch(`${BASE_URL}/suppliers/city/${encodedCity}`);
    if (!response.ok) throw new Error("Failed to fetch suppliers by city");
    const result: ApiResponse<Supplier[]> = await response.json();
    return result.data;
  }

  /**
   * Filter Suppliers by Country
   * Gets all suppliers in a specific country
   * @param country - Country name
   * @returns Promise<Supplier[]> Array of suppliers in the country
   */
  async getSuppliersByCountry(country: string): Promise<Supplier[]> {
    const encodedCountry = encodeURIComponent(country);
    const response = await fetch(
      `${BASE_URL}/suppliers/country/${encodedCountry}`
    );
    if (!response.ok) throw new Error("Failed to fetch suppliers by country");
    const result: ApiResponse<Supplier[]> = await response.json();
    return result.data;
  }

  /**
   * Get Supplier's Products
   * Retrieves all products associated with a supplier
   * @param supplierId - Supplier ID
   * @returns Promise<Product[]> Array of products
   */
  async getSupplierProducts(supplierId: number): Promise<Product[]> {
    const response = await fetch(
      `${BASE_URL}/suppliers/${supplierId}/products`
    );
    if (!response.ok)
      throw new Error("Failed to fetch supplier's products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data;
  }

  /**
   * Get Supplier's Active Products Only
   * Retrieves only active products for a supplier
   * @param supplierId - Supplier ID
   * @returns Promise<Product[]> Array of active products
   */
  async getSupplierActiveProducts(supplierId: number): Promise<Product[]> {
    const response = await fetch(
      `${BASE_URL}/suppliers/${supplierId}/products/active`
    );
    if (!response.ok)
      throw new Error("Failed to fetch supplier's active products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data;
  }

  /**
   * Activate Supplier
   * Sets supplier's isActive flag to true
   * @param id - Supplier ID
   * @returns Promise<Supplier> Updated supplier
   */
  async activateSupplier(id: number): Promise<Supplier> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}/activate`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to activate supplier");
    const result: ApiResponse<Supplier> = await response.json();
    return result.data;
  }

  /**
   * Deactivate Supplier
   * Sets supplier's isActive flag to false
   * @param id - Supplier ID
   * @returns Promise<Supplier> Updated supplier
   */
  async deactivateSupplier(id: number): Promise<Supplier> {
    const response = await fetch(`${BASE_URL}/suppliers/${id}/deactivate`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to deactivate supplier");
    const result: ApiResponse<Supplier> = await response.json();
    return result.data;
  }

  // ============================================================
  // PRODUCT ENDPOINTS
  // ============================================================

  /**
   * Get All Products
   * Retrieves all products from all suppliers
   * @returns Promise<Product[]> Array of all products
   */
  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data;
  }

  /**
   * Get Active Products Only
   * Retrieves only products with isActive = true
   * @returns Promise<Product[]> Array of active products
   */
  async getActiveProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products/active`);
    if (!response.ok) throw new Error("Failed to fetch active products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data;
  }

  /**
   * Get Product by ID
   * Retrieves a single product by its unique ID
   * @param id - Product ID
   * @returns Promise<Product> Product object
   * @throws Error if product not found (404)
   */
  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      throw new Error("Failed to fetch product");
    }
    const result: ApiResponse<Product> = await response.json();
    return result.data;
  }

  /**
   * Create New Product
   * Creates a new product under a supplier
   * @param productData - Product information
   * @returns Promise<Product> Created product with generated ID
   * @throws Error if supplier not found (404) or validation fails (400)
   */
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      if (response.status === 404) {
        throw new Error("Supplier not found");
      }
      if (response.status === 400 && error.errors) {
        throw new Error(error.errors.join(", "));
      }
      throw new Error(error.message || "Failed to create product");
    }

    const result: ApiResponse<Product> = await response.json();
    return result.data;
  }

  /**
   * Update Existing Product
   * Updates an existing product's information
   * @param id - Product ID to update
   * @param productData - Updated product information
   * @returns Promise<Product> Updated product
   * @throws Error if product not found (404) or validation fails (400)
   */
  async updateProduct(
    id: number,
    productData: UpdateProductRequest
  ): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      if (response.status === 400 && error.errors) {
        throw new Error(error.errors.join(", "));
      }
      throw new Error(error.message || "Failed to update product");
    }

    const result: ApiResponse<Product> = await response.json();
    return result.data;
  }

  /**
   * Soft Delete Product
   * Marks product as deleted but preserves data
   * @param id - Product ID to delete
   * @returns Promise<void>
   * @throws Error if product not found (404)
   */
  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      throw new Error("Failed to delete product");
    }
  }

  /**
   * Search Products by Name
   * Performs case-insensitive partial match search
   * @param name - Search term
   * @returns Promise<Product[]> Array of matching products
   */
  async searchProducts(name: string): Promise<Product[]> {
    const encodedSearch = encodeURIComponent(name);
    const response = await fetch(
      `${BASE_URL}/products/search?name=${encodedSearch}`
    );
    if (!response.ok) throw new Error("Failed to search products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data;
  }
}

// Export singleton instance for use across the application
export const supplierAPI = new SupplierManagementAPI();

// Export class for testing or custom instantiation
export default SupplierManagementAPI;
