# Frontend Developer Guide - Supplier Management System

## 📋 Project Overview

This is a **Supplier Management Microservice** built with Spring Boot 3.2.3 that provides RESTful APIs for managing suppliers and their products. The system supports complete CRUD operations, search functionality, soft delete, and relationship management.

---

## 🚀 Quick Start Information

### Base Configuration
- **Backend URL:** `http://localhost:8085`
- **API Base Path:** `/api/v1`
- **Full API URL:** `http://localhost:8085/api/v1`
- **Database:** PostgreSQL
- **Port:** 8085

### CORS Configuration
CORS is **enabled** for the following origins:
- `http://localhost:3000` (React default)
- `http://localhost:4200` (Angular default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue default)

**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS  
**Allowed Headers:** All headers (`*`)  
**Credentials:** Allowed

### Security Configuration
- Currently configured with **permitAll()** for all endpoints
- No authentication required for API access
- Ready to add JWT or OAuth2 authentication in the future

---

## 📊 Data Models

### Supplier Object
```typescript
interface Supplier {
  supplierId: number;
  email: string;              // Unique, required
  companyName: string;        // Required
  contactPerson: string;      // Required
  phone?: string;             // Optional
  address?: string;           // Optional
  city?: string;              // Optional
  country?: string;           // Optional
  contractStartDate?: string; // Format: "YYYY-MM-DD"
  contractEndDate?: string;   // Format: "YYYY-MM-DD"
  isActive: boolean;          // Default: true
  createdAt: string;          // ISO timestamp
  products?: Product[];       // Array of products
}
```

### Product Object
```typescript
interface Product {
  productId: number;
  productName: string;        // Required
  description?: string;       // Optional
  unitPrice: number;          // Required, positive
  quantityInStock: number;    // Required, non-negative
  supplierId: number;         // Required, FK to Supplier
  supplierName?: string;      // Included in some responses
  isActive: boolean;          // Default: true
  createdAt: string;          // ISO timestamp
}
```

### API Response Wrapper
All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;  // ISO timestamp
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];      // Validation errors
  timestamp: string;
}
```

---

## 🔌 Complete API Reference

### 🏢 Supplier Endpoints

#### 1. Get All Suppliers
```http
GET /api/v1/suppliers
```
**Response:** `ApiResponse<Supplier[]>`

**Use Case:** Display all suppliers in a table/list

---

#### 2. Get Active Suppliers Only
```http
GET /api/v1/suppliers/active
```
**Response:** `ApiResponse<Supplier[]>`

**Use Case:** Show only active suppliers in dropdown or active list

---

#### 3. Get Supplier by ID
```http
GET /api/v1/suppliers/{id}
```
**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `ApiResponse<Supplier>`

**Use Case:** View supplier details page, edit form

**Error Responses:**
- `404 Not Found`: Supplier doesn't exist

---

#### 4. Create New Supplier
```http
POST /api/v1/suppliers
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "supplier@example.com",
  "companyName": "ABC Corporation",
  "contactPerson": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2025-12-31",
  "isActive": true
}
```

**Response:** `201 Created` with `ApiResponse<Supplier>`

**Validation Rules:**
- `email`: Must be valid email format, unique, max 150 chars
- `companyName`: Required, max 150 chars
- `contactPerson`: Required, max 100 chars
- `phone`: Max 20 chars
- `city`: Max 80 chars
- `country`: Max 80 chars

**Error Responses:**
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists

---

#### 5. Update Supplier
```http
PUT /api/v1/suppliers/{id}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number): Supplier ID

**Request Body:** Same as Create Supplier

**Response:** `200 OK` with `ApiResponse<Supplier>`

**Error Responses:**
- `404 Not Found`: Supplier doesn't exist
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists (if changed)

---

#### 6. Soft Delete Supplier
```http
DELETE /api/v1/suppliers/{id}
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `200 OK`

**Note:** Sets `deleted_at` timestamp but keeps data in database

**Error Responses:**
- `404 Not Found`: Supplier doesn't exist

---

#### 7. Hard Delete Supplier (Permanent)
```http
DELETE /api/v1/suppliers/{id}/hard
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `200 OK`

**Warning:** Permanently removes from database. Use with caution!

**Error Responses:**
- `404 Not Found`: Supplier doesn't exist

---

#### 8. Get Supplier's Products
```http
GET /api/v1/suppliers/{id}/products
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `ApiResponse<Product[]>`

**Use Case:** View all products of a supplier

---

#### 9. Get Supplier's Active Products
```http
GET /api/v1/suppliers/{id}/products/active
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `ApiResponse<Product[]>`

**Use Case:** Show only active products for a supplier

---

#### 10. Search Suppliers by Company Name
```http
GET /api/v1/suppliers/search?companyName={searchTerm}
```

**Query Parameters:**
- `companyName` (string): Search term (case-insensitive, partial match)

**Response:** `ApiResponse<Supplier[]>`

**Example:** `/api/v1/suppliers/search?companyName=tech`

**Use Case:** Autocomplete, search bar

---

#### 11. Filter Suppliers by City
```http
GET /api/v1/suppliers/city/{city}
```

**Path Parameters:**
- `city` (string): City name

**Response:** `ApiResponse<Supplier[]>`

**Example:** `/api/v1/suppliers/city/New York`

---

#### 12. Filter Suppliers by Country
```http
GET /api/v1/suppliers/country/{country}
```

**Path Parameters:**
- `country` (string): Country name

**Response:** `ApiResponse<Supplier[]>`

**Example:** `/api/v1/suppliers/country/USA`

---

#### 13. Activate Supplier
```http
PATCH /api/v1/suppliers/{id}/activate
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `200 OK` with `ApiResponse<Supplier>`

**Use Case:** Toggle supplier status to active

---

#### 14. Deactivate Supplier
```http
PATCH /api/v1/suppliers/{id}/deactivate
```

**Path Parameters:**
- `id` (number): Supplier ID

**Response:** `200 OK` with `ApiResponse<Supplier>`

**Use Case:** Toggle supplier status to inactive

---

### 📦 Product Endpoints

#### 1. Get All Products
```http
GET /api/v1/products
```
**Response:** `ApiResponse<Product[]>`

**Use Case:** Display all products

---

#### 2. Get Active Products Only
```http
GET /api/v1/products/active
```
**Response:** `ApiResponse<Product[]>`

**Use Case:** Show only active products

---

#### 3. Get Product by ID
```http
GET /api/v1/products/{id}
```

**Path Parameters:**
- `id` (number): Product ID

**Response:** `ApiResponse<Product>`

**Error Responses:**
- `404 Not Found`: Product doesn't exist

---

#### 4. Create New Product
```http
POST /api/v1/products
Content-Type: application/json
```

**Request Body:**
```json
{
  "productName": "Laptop Pro 15",
  "description": "High-performance laptop",
  "unitPrice": 1299.99,
  "quantityInStock": 50,
  "supplierId": 1,
  "isActive": true
}
```

**Response:** `201 Created` with `ApiResponse<Product>`

**Validation Rules:**
- `productName`: Required, max 150 chars
- `unitPrice`: Required, must be positive
- `quantityInStock`: Required, must be >= 0
- `supplierId`: Required, must reference existing supplier

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Supplier doesn't exist

---

#### 5. Update Product
```http
PUT /api/v1/products/{id}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number): Product ID

**Request Body:** Same as Create Product

**Response:** `200 OK` with `ApiResponse<Product>`

**Error Responses:**
- `404 Not Found`: Product or Supplier doesn't exist
- `400 Bad Request`: Validation failed

---

#### 6. Soft Delete Product
```http
DELETE /api/v1/products/{id}
```

**Path Parameters:**
- `id` (number): Product ID

**Response:** `200 OK`

**Note:** Soft delete - data preserved

**Error Responses:**
- `404 Not Found`: Product doesn't exist

---

#### 7. Search Products by Name
```http
GET /api/v1/products/search?name={searchTerm}
```

**Query Parameters:**
- `name` (string): Search term (case-insensitive, partial match)

**Response:** `ApiResponse<Product[]>`

**Example:** `/api/v1/products/search?name=laptop`

---

## ⚠️ Error Handling

### HTTP Status Codes
- **200 OK**: Successful GET, PUT, PATCH, DELETE
- **201 Created**: Successful POST (creation)
- **400 Bad Request**: Validation errors, invalid data
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate email (supplier)
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Validation error 1",
    "Validation error 2"
  ],
  "timestamp": "2026-03-05T10:30:00.123Z"
}
```

### Common Error Messages
- **"Supplier with email [email] already exists"**: Duplicate email
- **"Supplier not found with id: [id]"**: Invalid supplier ID
- **"Product not found with id: [id]"**: Invalid product ID
- **"Supplier must be active to add products"**: Inactive supplier
- **"Email should be valid"**: Invalid email format
- **"Unit price must be positive"**: Negative or zero price
- **"Quantity must be non-negative"**: Negative quantity

---

## 🎯 Example Frontend Implementations

### React/TypeScript Example

#### API Service Setup
```typescript
// api/api.config.ts
export const API_BASE_URL = 'http://localhost:8085/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### Supplier Service
```typescript
// services/supplierService.ts
import { apiClient } from '../api/api.config';

export interface Supplier {
  supplierId?: number;
  email: string;
  companyName: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const supplierService = {
  // Get all suppliers
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers');
    return response.data;
  },

  // Get supplier by ID
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data;
  },

  // Create supplier
  create: async (supplier: Supplier) => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', supplier);
    return response.data;
  },

  // Update supplier
  update: async (id: number, supplier: Supplier) => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, supplier);
    return response.data;
  },

  // Delete supplier
  delete: async (id: number) => {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data;
  },

  // Search suppliers
  search: async (companyName: string) => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>(
      `/suppliers/search?companyName=${encodeURIComponent(companyName)}`
    );
    return response.data;
  },

  // Activate/Deactivate
  activate: async (id: number) => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number) => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}/deactivate`);
    return response.data;
  },
};
```

#### Product Service
```typescript
// services/productService.ts
import { apiClient } from '../api/api.config';

export interface Product {
  productId?: number;
  productName: string;
  description?: string;
  unitPrice: number;
  quantityInStock: number;
  supplierId: number;
  supplierName?: string;
  isActive: boolean;
}

export const productService = {
  // Get all products
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },

  // Get product by ID
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (product: Product) => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', product);
    return response.data;
  },

  // Update product
  update: async (id: number, product: Product) => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  delete: async (id: number) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Search products
  search: async (name: string) => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  },
};
```

#### React Component Example
```typescript
// components/SupplierList.tsx
import React, { useEffect, useState } from 'react';
import { supplierService, Supplier } from '../services/supplierService';

export const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.delete(id);
        loadSuppliers(); // Reload list
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete supplier');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Suppliers</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Email</th>
            <th>Contact Person</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.supplierId}>
              <td>{supplier.supplierId}</td>
              <td>{supplier.companyName}</td>
              <td>{supplier.email}</td>
              <td>{supplier.contactPerson}</td>
              <td>{supplier.city}</td>
              <td>{supplier.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleDelete(supplier.supplierId!)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 📝 Form Validation Guidelines

### Supplier Form
```typescript
const supplierValidation = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    },
    maxLength: {
      value: 150,
      message: 'Email must be less than 150 characters'
    }
  },
  companyName: {
    required: 'Company name is required',
    maxLength: {
      value: 150,
      message: 'Company name must be less than 150 characters'
    }
  },
  contactPerson: {
    required: 'Contact person is required',
    maxLength: {
      value: 100,
      message: 'Contact person must be less than 100 characters'
    }
  },
  phone: {
    maxLength: {
      value: 20,
      message: 'Phone must be less than 20 characters'
    }
  }
};
```

### Product Form
```typescript
const productValidation = {
  productName: {
    required: 'Product name is required',
    maxLength: {
      value: 150,
      message: 'Product name must be less than 150 characters'
    }
  },
  unitPrice: {
    required: 'Unit price is required',
    min: {
      value: 0.01,
      message: 'Price must be positive'
    }
  },
  quantityInStock: {
    required: 'Quantity is required',
    min: {
      value: 0,
      message: 'Quantity cannot be negative'
    }
  },
  supplierId: {
    required: 'Supplier is required'
  }
};
```

---

## 🧪 Testing the Backend

### Health Check
Before starting frontend development, verify the backend is running:

```bash
# Simple health check
curl http://localhost:8085/api/v1/suppliers
```

### Test with Sample Data

#### 1. Create a Supplier
```bash
curl -X POST http://localhost:8085/api/v1/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "companyName": "Test Company",
    "contactPerson": "Test Person",
    "isActive": true
  }'
```

#### 2. Get All Suppliers
```bash
curl http://localhost:8085/api/v1/suppliers
```

#### 3. Create a Product
```bash
curl -X POST http://localhost:8085/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "unitPrice": 99.99,
    "quantityInStock": 10,
    "supplierId": 1,
    "isActive": true
  }'
```

---

## 🗄️ Database Relationships

### Entity Relationship
```
SUPPLIER (1) ──── Has Many ───→ (N) PRODUCT
```

- One Supplier can have **multiple Products**
- Each Product belongs to **one Supplier**
- When retrieving supplier details, products can be included in the response
- Foreign key: `product.supplier_id` → `supplier.supplier_id`

### Soft Delete Behavior
- Both Suppliers and Products use **soft delete**
- Deleted records have `deleted_at` timestamp set
- Deleted records are **automatically excluded** from queries
- Original data is preserved for audit purposes

---

## 🎨 Recommended Frontend Features

### 1. Supplier Management
- **List View**: Display all suppliers in a table with search/filter
- **Detail View**: Show supplier info with their products
- **Create Form**: Add new supplier with validation
- **Edit Form**: Update supplier information
- **Status Toggle**: Activate/Deactivate suppliers
- **Delete Confirmation**: Soft delete with confirmation dialog

### 2. Product Management
- **List View**: Display all products with supplier names
- **Filter by Supplier**: Show products for selected supplier
- **Create Form**: Add product with supplier dropdown
- **Edit Form**: Update product details
- **Stock Management**: Update quantity in stock
- **Price Display**: Format currency properly

### 3. Search & Filters
- **Supplier Search**: Search by company name (autocomplete)
- **Location Filter**: Filter by city/country
- **Status Filter**: Active/Inactive toggle
- **Product Search**: Search by product name
- **Price Range**: Filter products by price

### 4. Dashboard
- **Total Suppliers**: Count of all suppliers
- **Active Suppliers**: Count of active suppliers
- **Total Products**: Count of all products
- **Low Stock Alerts**: Products with low quantity
- **Supplier Distribution**: Chart by country/city

---

## 🔧 Development Tips

### 1. Environment Configuration
Create a `.env` file for your frontend:
```env
VITE_API_BASE_URL=http://localhost:8085/api/v1
REACT_APP_API_BASE_URL=http://localhost:8085/api/v1
```

### 2. Error Handling
Always handle API errors gracefully:
```typescript
try {
  const response = await supplierService.create(supplierData);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
    setErrors(error.response.data.errors || []);
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### 3. Date Formatting
The API expects dates in `YYYY-MM-DD` format:
```typescript
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
```

### 4. Loading States
Always show loading indicators during API calls:
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await supplierService.create(data);
  } finally {
    setLoading(false);
  }
};
```

---

## 📞 Support & Documentation

### Additional Resources
- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Database Schema**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- **Testing Guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Postman Collection**: [POSTMAN_COLLECTION.md](POSTMAN_COLLECTION.md)

### Backend Repository
- **Location**: `d:\My Projects\nethmi\smart-solutions-ssms\ssms\supplier-management`
- **Main Application**: `SupplierManagementApplication.java`
- **Port**: 8085

---

## ✅ Pre-Development Checklist

Before starting frontend development:

- [ ] Backend is running on port 8085
- [ ] Database is set up and connected
- [ ] CORS is configured for your frontend port
- [ ] API endpoints are accessible (test with curl/Postman)
- [ ] Sample data is created for testing
- [ ] API response structure is understood
- [ ] Error handling patterns are reviewed
- [ ] TypeScript interfaces are defined

---

## 🚀 Next Steps

1. **Set up your frontend project** (React, Angular, Vue, etc.)
2. **Configure API base URL** in your environment
3. **Create service/API layer** for communication
4. **Implement TypeScript interfaces** for type safety
5. **Build components** for Supplier and Product management
6. **Add form validation** matching backend rules
7. **Implement error handling** for all API calls
8. **Test with real backend** using sample data
9. **Add loading states** and user feedback
10. **Build dashboard** with statistics and charts

---

**Happy Coding! 🎉**

For any questions or issues with the backend API, refer to the documentation files or test the endpoints using the Postman collection provided.
