# Supplier Management API Documentation

## Base URL
```
http://localhost:8085/api/v1
```

---

## Table of Contents
1. [Supplier Endpoints](#supplier-endpoints)
2. [Product Endpoints](#product-endpoints)
3. [Request/Response Examples](#request-response-examples)
4. [Error Handling](#error-handling)

---

## Supplier Endpoints

### 1. Get All Suppliers
Retrieve all suppliers from the system.

**Endpoint:** `GET /suppliers`

**Response:**
```json
{
  "success": true,
  "message": "Suppliers retrieved successfully",
  "data": [...],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 2. Get All Active Suppliers
Retrieve only active suppliers.

**Endpoint:** `GET /suppliers/active`

**Response:** Same structure as Get All Suppliers

---

### 3. Get Supplier by ID
Retrieve a specific supplier by their ID.

**Endpoint:** `GET /suppliers/{id}`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:**
```json
{
  "success": true,
  "message": "Supplier retrieved successfully",
  "data": {
    "supplierId": 1,
    "email": "supplier@example.com",
    "companyName": "ABC Corporation",
    "contactPerson": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "contractStartDate": "2024-01-01",
    "contractEndDate": "2025-12-31",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "products": [...]
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 4. Create Supplier
Create a new supplier.

**Endpoint:** `POST /suppliers`

**Request Body:**
```json
{
  "email": "newsupplier@example.com",
  "companyName": "New Company Ltd",
  "contactPerson": "Jane Smith",
  "phone": "+9876543210",
  "address": "456 Business Ave",
  "city": "Los Angeles",
  "country": "USA",
  "contractStartDate": "2024-03-01",
  "contractEndDate": "2026-03-01",
  "isActive": true
}
```

**Response:** HTTP 201 Created
```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {...},
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 5. Update Supplier
Update an existing supplier.

**Endpoint:** `PUT /suppliers/{id}`

**Path Parameters:**
- `id` (Long): Supplier ID

**Request Body:** Same as Create Supplier

**Response:** HTTP 200 OK

---

### 6. Delete Supplier (Soft Delete)
Soft delete a supplier (sets deleted_at timestamp).

**Endpoint:** `DELETE /suppliers/{id}`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:**
```json
{
  "success": true,
  "message": "Supplier deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 7. Hard Delete Supplier
Permanently delete a supplier from the database.

**Endpoint:** `DELETE /suppliers/{id}/hard`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:** Same as soft delete

---

### 8. Get Supplier Products
Retrieve all products for a specific supplier.

**Endpoint:** `GET /suppliers/{id}/products`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:**
```json
{
  "success": true,
  "message": "Supplier products retrieved successfully",
  "data": [
    {
      "productId": 1,
      "productName": "Product A",
      "description": "Description of Product A",
      "unitPrice": 99.99,
      "quantityInStock": 100,
      "supplierId": 1,
      "supplierName": "ABC Corporation",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00"
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 9. Get Supplier Active Products
Retrieve only active products for a specific supplier.

**Endpoint:** `GET /suppliers/{id}/products/active`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:** Same structure as Get Supplier Products

---

### 10. Search Suppliers by Company Name
Search suppliers by company name (case-insensitive partial match).

**Endpoint:** `GET /suppliers/search?companyName={name}`

**Query Parameters:**
- `companyName` (String): Search term

**Response:** List of matching suppliers

---

### 11. Get Suppliers by City
Retrieve suppliers from a specific city.

**Endpoint:** `GET /suppliers/city/{city}`

**Path Parameters:**
- `city` (String): City name

**Response:** List of suppliers in that city

---

### 12. Get Suppliers by Country
Retrieve suppliers from a specific country.

**Endpoint:** `GET /suppliers/country/{country}`

**Path Parameters:**
- `country` (String): Country name

**Response:** List of suppliers in that country

---

### 13. Activate Supplier
Activate an inactive supplier.

**Endpoint:** `PATCH /suppliers/{id}/activate`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:** Updated supplier object

---

### 14. Deactivate Supplier
Deactivate an active supplier.

**Endpoint:** `PATCH /suppliers/{id}/deactivate`

**Path Parameters:**
- `id` (Long): Supplier ID

**Response:** Updated supplier object

---

## Product Endpoints

### 1. Get All Products
Retrieve all products from the system.

**Endpoint:** `GET /products`

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [...],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 2. Get All Active Products
Retrieve only active products.

**Endpoint:** `GET /products/active`

**Response:** Same structure as Get All Products

---

### 3. Get Product by ID
Retrieve a specific product by its ID.

**Endpoint:** `GET /products/{id}`

**Path Parameters:**
- `id` (Long): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "productId": 1,
    "productName": "Product A",
    "description": "High-quality product",
    "unitPrice": 149.99,
    "quantityInStock": 50,
    "supplierId": 1,
    "supplierName": "ABC Corporation",
    "isActive": true,
    "createdAt": "2024-02-01T10:00:00"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 4. Create Product
Create a new product.

**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "productName": "New Product",
  "description": "Product description",
  "unitPrice": 199.99,
  "quantityInStock": 75,
  "supplierId": 1,
  "isActive": true
}
```

**Response:** HTTP 201 Created

---

### 5. Update Product
Update an existing product.

**Endpoint:** `PUT /products/{id}`

**Path Parameters:**
- `id` (Long): Product ID

**Request Body:** Same as Create Product

**Response:** HTTP 200 OK

---

### 6. Delete Product
Soft delete a product.

**Endpoint:** `DELETE /products/{id}`

**Path Parameters:**
- `id` (Long): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### 7. Search Products by Name
Search products by name (case-insensitive partial match).

**Endpoint:** `GET /products/search?name={productName}`

**Query Parameters:**
- `name` (String): Search term

**Response:** List of matching products

---

## Error Handling

### Error Response Format
```json
{
  "timestamp": "2026-03-04T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Supplier not found with id: '999'",
  "path": "/api/v1/suppliers/999"
}
```

### Validation Error Response
```json
{
  "timestamp": "2026-03-04T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "path": "/api/v1/suppliers",
  "validationErrors": {
    "email": "Invalid email format",
    "companyName": "Company name is required"
  }
}
```

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error or invalid request
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., email already exists)
- `500 Internal Server Error`: Unexpected server error

---

## Validation Rules

### Supplier
- `email`: Required, must be valid email format, max 150 characters, must be unique
- `companyName`: Required, max 150 characters
- `contactPerson`: Required, max 100 characters
- `phone`: Optional, max 20 characters
- `city`: Optional, max 80 characters
- `country`: Optional, max 80 characters

### Product
- `productName`: Required
- `unitPrice`: Must be positive
- `quantityInStock`: Must be zero or positive
- `supplierId`: Required, must reference existing supplier

---

## Notes

1. All timestamps are in ISO 8601 format
2. Soft delete is used by default (data is preserved)
3. The API uses stateless authentication (currently permitAll for testing)
4. CORS is enabled for all origins (configure for production)
5. All list endpoints return active records by default unless using specific soft-deleted queries
