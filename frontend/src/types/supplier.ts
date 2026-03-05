// ====================================
// SUPPLIER MANAGEMENT TYPES
// Purpose: Type definitions for Supplier Management System
// Backend: http://localhost:8085/api/v1
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// ====================================

/**
 * Supplier Entity
 * Represents a complete supplier record from the database
 */
export interface Supplier {
  supplierId: number;
  email: string;              // Unique identifier, required
  companyName: string;        // Business name, required
  contactPerson: string;      // Primary contact name, required
  phone?: string;             // Contact phone number, optional
  address?: string;           // Street address, optional
  city?: string;              // City location, optional
  country?: string;           // Country location, optional
  contractStartDate?: string; // Format: "YYYY-MM-DD"
  contractEndDate?: string;   // Format: "YYYY-MM-DD"
  isActive: boolean;          // Active status flag
  createdAt: string;          // ISO timestamp
  products?: Product[];       // Associated products array
  deletedAt?: string | null;  // Soft delete timestamp
}

/**
 * Create Supplier Request
 * Used when creating a new supplier via POST endpoint
 */
export interface CreateSupplierRequest {
  email: string;              // Must be unique and valid email format
  companyName: string;        // Max 150 characters
  contactPerson: string;      // Max 100 characters
  phone?: string;             // Max 20 characters
  address?: string;           // Full street address
  city?: string;              // Max 80 characters
  country?: string;           // Max 80 characters
  contractStartDate?: string; // Optional contract start date
  contractEndDate?: string;   // Optional contract end date
  isActive?: boolean;         // Defaults to true if not provided
}

/**
 * Update Supplier Request
 * Used when updating an existing supplier via PUT endpoint
 * All fields are optional to support partial updates
 */
export interface UpdateSupplierRequest {
  email?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  isActive?: boolean;
}

/**
 * Product Entity
 * Represents a product supplied by a supplier
 */
export interface Product {
  productId: number;
  productName: string;        // Product name, required
  description?: string;       // Product description, optional
  unitPrice: number;          // Price per unit, must be positive
  quantityInStock: number;    // Current stock quantity, non-negative
  supplierId: number;         // Foreign key to Supplier
  supplierName?: string;      // Supplier company name (included in responses)
  isActive: boolean;          // Active status flag
  createdAt: string;          // ISO timestamp
  deletedAt?: string | null;  // Soft delete timestamp
}

/**
 * Create Product Request
 * Used when creating a new product via POST endpoint
 */
export interface CreateProductRequest {
  productName: string;        // Required, max 150 characters
  description?: string;       // Optional description
  unitPrice: number;          // Required, must be > 0
  quantityInStock: number;    // Required, must be >= 0
  supplierId: number;         // Required, must reference existing supplier
  isActive?: boolean;         // Defaults to true if not provided
}

/**
 * Update Product Request
 * Used when updating an existing product via PUT endpoint
 */
export interface UpdateProductRequest {
  productName?: string;
  description?: string;
  unitPrice?: number;
  quantityInStock?: number;
  supplierId?: number;
  isActive?: boolean;
}

/**
 * API Response Wrapper
 * Standard response format from the backend
 * Generic type T represents the data payload
 */
export interface ApiResponse<T> {
  success: boolean;           // Indicates if request was successful
  message: string;            // Human-readable message
  data: T;                    // Response payload (generic type)
  timestamp: string;          // ISO timestamp of response
}

/**
 * API Error Response
 * Response format when an error occurs
 */
export interface ApiErrorResponse {
  success: false;             // Always false for errors
  message: string;            // Error description
  errors?: string[];          // Array of validation errors (if applicable)
  timestamp: string;          // ISO timestamp of error
}

/**
 * Supplier Filter Options
 * Used for filtering suppliers in the UI
 */
export interface SupplierFilterOptions {
  searchTerm?: string;        // Search by company name
  city?: string;              // Filter by city
  country?: string;           // Filter by country
  isActive?: boolean;         // Filter by active status
}

/**
 * Product Filter Options
 * Used for filtering products in the UI
 */
export interface ProductFilterOptions {
  searchTerm?: string;        // Search by product name
  supplierId?: number;        // Filter by supplier
  minPrice?: number;          // Minimum unit price
  maxPrice?: number;          // Maximum unit price
  isActive?: boolean;         // Filter by active status
}

/**
 * Supplier Statistics
 * Dashboard statistics for supplier analytics
 */
export interface SupplierStatistics {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  totalProducts: number;
  suppliersByCountry: { country: string; count: number }[];
  suppliersByCity: { city: string; count: number }[];
}
