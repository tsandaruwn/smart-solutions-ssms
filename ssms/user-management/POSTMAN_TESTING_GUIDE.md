# User Management API - Postman Testing Guide

## 📋 Overview
This guide will help you test all User Management API endpoints using Postman.

**Base URL:** `http://localhost:8081`  
**API Prefix:** `/api/users`

---

## 🚀 Quick Start

### Step 1: Import the Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Browse to: `User_Management_API_Tests.postman_collection.json`
5. Click **Import**

### Step 2: Verify Application is Running
- Ensure the Spring Boot application is running on port **8081**
- Check terminal output shows: `Tomcat started on port 8081`

---

## 📝 Test Scenarios

### ✅ 1. CREATE USER - Valid Request
**Request:** `POST /api/users`

```json
{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER"
}
```

**Expected Response:** `201 Created`
```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": 1,
        "username": "john_doe",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "role": "CUSTOMER",
        "status": "ACTIVE",
        "createdAt": "2026-02-01T22:46:00",
        "updatedAt": "2026-02-01T22:46:00"
    },
    "timestamp": "2026-02-01T22:46:00"
}
```

**Note:** Password is NOT returned in response (security best practice)

---

### ✅ 2. CREATE USER - Admin Role
**Request:** `POST /api/users`

```json
{
    "username": "admin_user",
    "email": "admin@ssms.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "phoneNumber": "+9876543210",
    "role": "ADMIN"
}
```

**Expected Response:** `201 Created`
- User created with ADMIN role
- ID: 2

---

### ✅ 3. CREATE USER - Minimal Fields
**Request:** `POST /api/users`

```json
{
    "username": "jane_smith",
    "email": "jane.smith@example.com",
    "password": "password456"
}
```

**Expected Response:** `201 Created`
- Default role: CUSTOMER
- Default status: ACTIVE
- firstName, lastName, phoneNumber: null

---

### ✅ 4. GET ALL USERS
**Request:** `GET /api/users`

**Expected Response:** `200 OK`
```json
{
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
        {
            "id": 1,
            "username": "john_doe",
            "email": "john.doe@example.com",
            ...
        },
        {
            "id": 2,
            "username": "admin_user",
            "email": "admin@ssms.com",
            ...
        }
    ],
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ✅ 5. GET USER BY ID - Valid
**Request:** `GET /api/users/1`

**Expected Response:** `200 OK`
```json
{
    "success": true,
    "message": "User retrieved successfully",
    "data": {
        "id": 1,
        "username": "john_doe",
        "email": "john.doe@example.com",
        ...
    },
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 6. GET USER BY ID - Not Found
**Request:** `GET /api/users/9999`

**Expected Response:** `404 Not Found`
```json
{
    "success": false,
    "message": "User not found with id: 9999",
    "data": null,
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ✅ 7. UPDATE USER - Full Update
**Request:** `PUT /api/users/1`

```json
{
    "username": "john_doe_updated",
    "email": "john.updated@example.com",
    "firstName": "John",
    "lastName": "Doe Updated",
    "phoneNumber": "+1234567899",
    "role": "ADMIN",
    "status": "ACTIVE"
}
```

**Expected Response:** `200 OK`
- All fields updated
- updatedAt timestamp changed

---

### ✅ 8. UPDATE USER - Partial Update
**Request:** `PUT /api/users/2`

```json
{
    "firstName": "Jane",
    "lastName": "Smith Updated",
    "phoneNumber": "+9999999999"
}
```

**Expected Response:** `200 OK`
- Only specified fields updated
- Other fields remain unchanged

---

### ✅ 9. DELETE USER - Valid
**Request:** `DELETE /api/users/3`

**Expected Response:** `200 OK`
```json
{
    "success": true,
    "message": "User deleted successfully",
    "data": null,
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 10. DELETE USER - Not Found
**Request:** `DELETE /api/users/9999`

**Expected Response:** `404 Not Found`
```json
{
    "success": false,
    "message": "User not found with id: 9999",
    "data": null,
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 11. VALIDATION ERROR - Missing Required Fields
**Request:** `POST /api/users`

```json
{
    "username": "test"
}
```

**Expected Response:** `400 Bad Request`
```json
{
    "success": false,
    "message": "Validation error",
    "data": {
        "email": "Email is required",
        "password": "Password is required"
    },
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 12. VALIDATION ERROR - Invalid Email
**Request:** `POST /api/users`

```json
{
    "username": "testuser",
    "email": "invalid-email",
    "password": "password123"
}
```

**Expected Response:** `400 Bad Request`
```json
{
    "success": false,
    "message": "Validation error",
    "data": {
        "email": "Email should be valid"
    },
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 13. VALIDATION ERROR - Short Password
**Request:** `POST /api/users`

```json
{
    "username": "testuser2",
    "email": "test@example.com",
    "password": "123"
}
```

**Expected Response:** `400 Bad Request`
```json
{
    "success": false,
    "message": "Validation error",
    "data": {
        "password": "Password must be at least 6 characters"
    },
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 14. DUPLICATE USERNAME ERROR
**Request:** `POST /api/users` (with existing username)

```json
{
    "username": "john_doe",
    "email": "different@example.com",
    "password": "password123"
}
```

**Expected Response:** `409 Conflict`
```json
{
    "success": false,
    "message": "Username already exists",
    "data": null,
    "timestamp": "2026-02-01T22:46:00"
}
```

---

### ❌ 15. DUPLICATE EMAIL ERROR
**Request:** `POST /api/users` (with existing email)

```json
{
    "username": "different_user",
    "email": "john.doe@example.com",
    "password": "password123"
}
```

**Expected Response:** `409 Conflict`
```json
{
    "success": false,
    "message": "Email already exists",
    "data": null,
    "timestamp": "2026-02-01T22:46:00"
}
```

---

## 🧪 Testing Sequence

### Recommended Testing Order:

1. **Create Users** (Tests 1-3)
   - Creates sample data for subsequent tests
   
2. **Read Operations** (Tests 4-6)
   - Verify data retrieval works correctly
   
3. **Update Operations** (Tests 7-8)
   - Test partial and full updates
   
4. **Validation Tests** (Tests 11-13)
   - Verify input validation works
   
5. **Business Logic Tests** (Tests 14-15)
   - Test duplicate detection
   
6. **Delete Operations** (Tests 9-10)
   - Test deletion (run these last)

---

## 🎯 Test Checklist

- [ ] All CREATE tests pass (201 Created)
- [ ] All READ tests pass (200 OK or 404 Not Found)
- [ ] All UPDATE tests pass (200 OK or 404 Not Found)
- [ ] All DELETE tests pass (200 OK or 404 Not Found)
- [ ] Validation errors return 400 Bad Request
- [ ] Duplicate errors return 409 Conflict
- [ ] Not found errors return 404 Not Found
- [ ] Response structure is consistent
- [ ] No passwords in responses
- [ ] Timestamps are populated

---

## 📊 Available User Roles

- `ADMIN` - Administrator
- `CUSTOMER` - Customer
- `SUPPLIER` - Supplier
- `TECHNICIAN` - Technician
- `SALES_REPRESENTATIVE` - Sales Representative

## 📊 Available User Statuses

- `ACTIVE` - Active user (default)
- `INACTIVE` - Inactive user
- `SUSPENDED` - Suspended user
- `DELETED` - Deleted user

---

## 🔍 Troubleshooting

### Application Not Running
**Error:** `Could not get any response`  
**Solution:** Start the application with `mvnw spring-boot:run`

### Connection Refused
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:8081`  
**Solution:** Check application is running on port 8081

### Database Errors
**Error:** `could not execute statement`  
**Solution:** Verify PostgreSQL database is accessible

### Validation Not Working
**Error:** No validation errors returned  
**Solution:** Check `@Valid` annotation is present in controller

---

## 📸 Screenshot Reference

### Success Response Format:
```
✅ Status: 200 OK / 201 Created
{
    "success": true,
    "message": "...",
    "data": {...},
    "timestamp": "..."
}
```

### Error Response Format:
```
❌ Status: 400 / 404 / 409 / 500
{
    "success": false,
    "message": "...",
    "data": null or error details,
    "timestamp": "..."
}
```

---

## 🎓 Best Practices Implemented

✅ **Entity with private fields** - All fields use proper encapsulation  
✅ **DTOs for request/response** - Separate Request, Response, and Update DTOs  
✅ **Empty constructors** - All classes have no-args constructors  
✅ **Getters and Setters** - Proper accessor methods  
✅ **No hardcoded messages** - ResponseMessages utility class  
✅ **Clean structure** - Separated layers (controller, service, repository)  
✅ **Exception handling** - Global exception handler  
✅ **Validation** - Input validation with proper error messages  
✅ **Security** - Passwords not exposed in responses  

---

## 📝 Notes

- **Password Hashing:** In production, passwords should be hashed (BCrypt)
- **Authentication:** Add JWT or OAuth2 for production
- **Pagination:** Consider adding pagination for GET all users
- **Logging:** Application logs available in console
- **Database:** Using PostgreSQL on Supabase

---

**Happy Testing! 🎉**
