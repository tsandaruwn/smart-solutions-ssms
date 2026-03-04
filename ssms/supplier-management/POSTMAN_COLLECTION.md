# Postman Collection - Supplier Management API

## Quick Test Requests

Use these in Postman or any REST client:

---

### 1. CREATE SUPPLIER
```
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "supplier1@example.com",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "phone": "+1234567890",
  "address": "123 Tech Street",
  "city": "San Francisco",
  "country": "USA",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2026-12-31",
  "isActive": true
}
```

---

### 2. GET ALL SUPPLIERS
```
GET http://localhost:8085/api/v1/suppliers
```

---

### 3. GET SUPPLIER BY ID
```
GET http://localhost:8085/api/v1/suppliers/1
```

---

### 4. UPDATE SUPPLIER
```
PUT http://localhost:8085/api/v1/suppliers/1
Content-Type: application/json

{
  "email": "supplier1@example.com",
  "companyName": "Tech Solutions Inc - Updated",
  "contactPerson": "John Doe Jr.",
  "phone": "+1234567891",
  "address": "123 Tech Street, Suite 100",
  "city": "San Francisco",
  "country": "USA",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2027-12-31",
  "isActive": true
}
```

---

### 5. CREATE PRODUCT
```
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Laptop Pro 15",
  "description": "High-performance laptop for professionals",
  "unitPrice": 1299.99,
  "quantityInStock": 50,
  "supplierId": 1,
  "isActive": true
}
```

---

### 6. GET ALL PRODUCTS
```
GET http://localhost:8085/api/v1/products
```

---

### 7. GET SUPPLIER PRODUCTS
```
GET http://localhost:8085/api/v1/suppliers/1/products
```

---

### 8. UPDATE PRODUCT
```
PUT http://localhost:8085/api/v1/products/1
Content-Type: application/json

{
  "productName": "Laptop Pro 15 - Updated",
  "description": "Enhanced high-performance laptop",
  "unitPrice": 1399.99,
  "quantityInStock": 75,
  "supplierId": 1,
  "isActive": true
}
```

---

### 9. SEARCH SUPPLIERS
```
GET http://localhost:8085/api/v1/suppliers/search?companyName=tech
```

---

### 10. SEARCH PRODUCTS
```
GET http://localhost:8085/api/v1/products/search?name=laptop
```

---

### 11. GET SUPPLIERS BY CITY
```
GET http://localhost:8085/api/v1/suppliers/city/San Francisco
```

---

### 12. GET SUPPLIERS BY COUNTRY
```
GET http://localhost:8085/api/v1/suppliers/country/USA
```

---

### 13. DEACTIVATE SUPPLIER
```
PATCH http://localhost:8085/api/v1/suppliers/1/deactivate
```

---

### 14. ACTIVATE SUPPLIER
```
PATCH http://localhost:8085/api/v1/suppliers/1/activate
```

---

### 15. DELETE PRODUCT (Soft Delete)
```
DELETE http://localhost:8085/api/v1/products/1
```

---

### 16. DELETE SUPPLIER (Soft Delete)
```
DELETE http://localhost:8085/api/v1/suppliers/1
```

---

### 17. GET ACTIVE SUPPLIERS
```
GET http://localhost:8085/api/v1/suppliers/active
```

---

### 18. GET ACTIVE PRODUCTS
```
GET http://localhost:8085/api/v1/products/active
```

---

### 19. GET SUPPLIER ACTIVE PRODUCTS
```
GET http://localhost:8085/api/v1/suppliers/1/products/active
```

---

### 20. HARD DELETE SUPPLIER
```
DELETE http://localhost:8085/api/v1/suppliers/1/hard
```

---

## Testing Validation Errors

### Test Invalid Email
```
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "invalid-email",
  "companyName": "Test",
  "contactPerson": "Test Person"
}
```

### Test Missing Required Fields
```
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "test@test.com"
}
```

### Test Duplicate Email
```
POST http://localhost:8085/api/v1/suppliers
Content-Type: application/json

{
  "email": "supplier1@example.com",
  "companyName": "Another Company",
  "contactPerson": "Another Person"
}
```

### Test Negative Price
```
POST http://localhost:8085/api/v1/products
Content-Type: application/json

{
  "productName": "Invalid",
  "unitPrice": -10.00,
  "quantityInStock": 10,
  "supplierId": 1
}
```

---

## Notes

1. Replace `{id}` with actual IDs from your database
2. After creating a supplier, use its ID for creating products
3. Test in this order:
   - Create suppliers first
   - Then create products
   - Test read operations
   - Test update operations
   - Finally test delete operations
