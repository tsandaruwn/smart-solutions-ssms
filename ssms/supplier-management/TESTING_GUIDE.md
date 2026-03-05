# API Testing Guide - Supplier Management System

Test all CRUD operations step by step using the endpoints below.

## Base URL
```
http://localhost:8085/api/v1
```

---

## Testing Sequence

Follow this order to test all functionality:

### Step 1: Create Suppliers

#### 1.1 Create First Supplier
**Endpoint:** `POST /suppliers`

**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "tech@acmecorp.com",
  "companyName": "ACME Corporation",
  "contactPerson": "John Smith",
  "phone": "+1-555-0100",
  "address": "123 Technology Drive",
  "city": "San Francisco",
  "country": "USA",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2026-12-31",
  "isActive": true
}
```

**Expected Response:** HTTP 201 Created
```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {
    "supplierId": 1,
    "email": "tech@acmecorp.com",
    "companyName": "ACME Corporation",
    ...
  }
}
```

---

#### 1.2 Create Second Supplier
**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "info@globaltech.com",
  "companyName": "Global Tech Solutions",
  "contactPerson": "Sarah Johnson",
  "phone": "+1-555-0200",
  "address": "456 Innovation Boulevard",
  "city": "New York",
  "country": "USA",
  "contractStartDate": "2024-06-01",
  "contractEndDate": "2027-05-31",
  "isActive": true
}
```

---

#### 1.3 Create Third Supplier
**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "contact@techventures.com",
  "companyName": "Tech Ventures Ltd",
  "contactPerson": "Michael Brown",
  "phone": "+44-20-7123-4567",
  "address": "789 Business Park",
  "city": "London",
  "country": "UK",
  "contractStartDate": "2024-03-15",
  "contractEndDate": "2025-03-14",
  "isActive": true
}
```

---

### Step 2: Read/Retrieve Suppliers

#### 2.1 Get All Suppliers
**Request:**
```
GET http://localhost:8085/api/v1/suppliers
```

**Expected:** List of all 3 suppliers

---

#### 2.2 Get All Active Suppliers
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/active
```

**Expected:** All suppliers (all are active)

---

#### 2.3 Get Supplier by ID
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/1
```

**Expected:** Details of ACME Corporation

---

#### 2.4 Search Suppliers by Company Name
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/search?companyName=tech
```

**Expected:** Global Tech Solutions and Tech Ventures Ltd

---

#### 2.5 Get Suppliers by City
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/city/New York
```

**Expected:** Global Tech Solutions

---

#### 2.6 Get Suppliers by Country
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/country/USA
```

**Expected:** ACME Corporation and Global Tech Solutions

---

### Step 3: Create Products

#### 3.1 Create Product for Supplier 1
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Wireless Mouse Pro",
  "description": "High-precision wireless mouse with ergonomic design",
  "unitPrice": 49.99,
  "quantityInStock": 150,
  "supplierId": 1,
  "isActive": true
}
```

**Expected Response:** HTTP 201 Created

---

#### 3.2 Create Another Product for Supplier 1
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Mechanical Keyboard RGB",
  "description": "Premium mechanical keyboard with RGB lighting",
  "unitPrice": 129.99,
  "quantityInStock": 85,
  "supplierId": 1,
  "isActive": true
}
```

---

#### 3.3 Create Product for Supplier 2
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "27-inch Monitor 4K",
  "description": "Ultra HD 4K monitor with HDR support",
  "unitPrice": 399.99,
  "quantityInStock": 45,
  "supplierId": 2,
  "isActive": true
}
```

---

#### 3.4 Create Product for Supplier 3
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "USB-C Hub Adapter",
  "description": "Multi-port USB-C hub with 4K HDMI output",
  "unitPrice": 34.99,
  "quantityInStock": 200,
  "supplierId": 3,
  "isActive": true
}
```

---

### Step 4: Read Products

#### 4.1 Get All Products
**Request:**
```
GET http://localhost:8085/api/v1/products
```

**Expected:** List of all 4 products

---

#### 4.2 Get All Active Products
**Request:**
```
GET http://localhost:8085/api/v1/products/active
```

**Expected:** All 4 products

---

#### 4.3 Get Product by ID
**Request:**
```
GET http://localhost:8085/api/v1/products/1
```

**Expected:** Wireless Mouse Pro details

---

#### 4.4 Get Supplier's Products
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/1/products
```

**Expected:** Wireless Mouse Pro and Mechanical Keyboard RGB

---

#### 4.5 Get Supplier's Active Products
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/1/products/active
```

**Expected:** Both products from ACME Corporation

---

#### 4.6 Search Products by Name
**Request:**
```
GET http://localhost:8085/api/v1/products/search?name=mouse
```

**Expected:** Wireless Mouse Pro

---

### Step 5: Update Operations

#### 5.1 Update Supplier
**Request:**
```json
PUT http://localhost:8085/api/v1/suppliers/1
Content-Type: application/json

{
  "email": "tech@acmecorp.com",
  "companyName": "ACME Corporation",
  "contactPerson": "John Smith Jr.",
  "phone": "+1-555-0101",
  "address": "123 Technology Drive, Suite 500",
  "city": "San Francisco",
  "country": "USA",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2027-12-31",
  "isActive": true
}
```

**Expected:** HTTP 200 OK with updated supplier details

---

#### 5.2 Update Product
**Request:**
```json
PUT http://localhost:8085/api/v1/products/1
Content-Type: application/json

{
  "productName": "Wireless Mouse Pro 2.0",
  "description": "Enhanced high-precision wireless mouse with ergonomic design",
  "unitPrice": 59.99,
  "quantityInStock": 175,
  "supplierId": 1,
  "isActive": true
}
```

**Expected:** HTTP 200 OK with updated product details

---

### Step 6: Status Management

#### 6.1 Deactivate Supplier
**Request:**
```
PATCH http://localhost:8085/api/v1/suppliers/3/deactivate
```

**Expected:** Supplier 3 with isActive = false

---

#### 6.2 Verify Active Suppliers (Should Not Include Supplier 3)
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/active
```

**Expected:** Only Suppliers 1 and 2

---

#### 6.3 Activate Supplier
**Request:**
```
PATCH http://localhost:8085/api/v1/suppliers/3/activate
```

**Expected:** Supplier 3 with isActive = true

---

### Step 7: Delete Operations

#### 7.1 Soft Delete Product
**Request:**
```
DELETE http://localhost:8085/api/v1/products/4
```

**Expected:** HTTP 200 OK with success message

---

#### 7.2 Verify Product is Deleted
**Request:**
```
GET http://localhost:8085/api/v1/products/4
```

**Expected:** HTTP 404 Not Found

---

#### 7.3 Verify Active Products (Should Not Include Product 4)
**Request:**
```
GET http://localhost:8085/api/v1/products/active
```

**Expected:** Only 3 products listed

---

#### 7.4 Soft Delete Supplier
**Request:**
```
DELETE http://localhost:8085/api/v1/suppliers/3
```

**Expected:** HTTP 200 OK with success message

---

#### 7.5 Verify Supplier is Deleted
**Request:**
```
GET http://localhost:8085/api/v1/suppliers/3
```

**Expected:** HTTP 404 Not Found

---

### Step 8: Validation Testing

#### 8.1 Test Invalid Email
**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "invalid-email",
  "companyName": "Test Company",
  "contactPerson": "Test Person",
  "isActive": true
}
```

**Expected:** HTTP 400 Bad Request with validation error

---

#### 8.2 Test Duplicate Email
**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "tech@acmecorp.com",
  "companyName": "Another Company",
  "contactPerson": "Another Person",
  "isActive": true
}
```

**Expected:** HTTP 409 Conflict (Duplicate email)

---

#### 8.3 Test Missing Required Fields
**Request:**
```json
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "test@test.com"
}
```

**Expected:** HTTP 400 Bad Request with multiple validation errors

---

#### 8.4 Test Invalid Supplier ID for Product
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Test Product",
  "unitPrice": 99.99,
  "quantityInStock": 10,
  "supplierId": 9999,
  "isActive": true
}
```

**Expected:** HTTP 404 Not Found (Supplier not found)

---

#### 8.5 Test Negative Price
**Request:**
```json
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Invalid Product",
  "unitPrice": -10.00,
  "quantityInStock": 10,
  "supplierId": 1,
  "isActive": true
}
```

**Expected:** HTTP 400 Bad Request (Price must be positive)

---

## Summary of All Endpoints

### Supplier Endpoints (15 total)
1. ✅ GET `/suppliers` - Get all suppliers
2. ✅ GET `/suppliers/active` - Get active suppliers
3. ✅ GET `/suppliers/{id}` - Get supplier by ID
4. ✅ POST `/suppliers` - Create supplier
5. ✅ PUT `/suppliers/{id}` - Update supplier
6. ✅ DELETE `/suppliers/{id}` - Soft delete supplier
7. ✅ DELETE `/suppliers/{id}/hard` - Hard delete supplier
8. ✅ GET `/suppliers/{id}/products` - Get supplier products
9. ✅ GET `/suppliers/{id}/products/active` - Get active products
10. ✅ GET `/suppliers/search?companyName={name}` - Search suppliers
11. ✅ GET `/suppliers/city/{city}` - Get by city
12. ✅ GET `/suppliers/country/{country}` - Get by country
13. ✅ PATCH `/suppliers/{id}/activate` - Activate supplier
14. ✅ PATCH `/suppliers/{id}/deactivate` - Deactivate supplier

### Product Endpoints (7 total)
1. ✅ GET `/products` - Get all products
2. ✅ GET `/products/active` - Get active products
3. ✅ GET `/products/{id}` - Get product by ID
4. ✅ POST `/products` - Create product
5. ✅ PUT `/products/{id}` - Update product
6. ✅ DELETE `/products/{id}` - Soft delete product
7. ✅ GET `/products/search?name={name}` - Search products

---

## Testing Tools

### Option 1: cURL Commands
Save commands to a script file and execute one by one.

### Option 2: Postman Collection
Import the requests into Postman and organize them into folders.

### Option 3: REST Client (VS Code)
Create a `.http` file with all requests and use REST Client extension.

### Option 4: Thunder Client (VS Code)
Use Thunder Client extension to organize and test APIs.

---

## Expected Results Summary

After completing all tests:
- ✅ 2-3 active suppliers in the system
- ✅ 3-4 active products linked to suppliers
- ✅ Validation working correctly
- ✅ Soft delete preserving data
- ✅ Search and filter operations working
- ✅ Relationship between suppliers and products maintained

---

## Troubleshooting

### Issue: Connection Refused
**Solution:** Ensure the application is running on port 8085

### Issue: Database Errors
**Solution:** Verify PostgreSQL is running and database exists

### Issue: 404 Not Found
**Solution:** Check the base URL is correct: `http://localhost:8085/api/v1`

### Issue: Validation Errors
**Solution:** Ensure all required fields are included in the request body

### Issue: Duplicate Key Error
**Solution:** Check that email addresses are unique across suppliers

---

**Happy Testing! 🚀**
