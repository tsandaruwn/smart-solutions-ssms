# User Management API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8081`  
**Last Updated:** March 4, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Response Structure](#response-structure)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [User Management](#user-management)
   - [Role Management](#role-management)
   - [Permission Management](#permission-management)
6. [Data Models](#data-models)
7. [Enumerations](#enumerations)
8. [Validation Rules](#validation-rules)
9. [HTTP Status Codes](#http-status-codes)
10. [Examples](#examples)

---

## Overview

The User Management Service provides a RESTful API for managing users, roles, and permissions in a Role-Based Access Control (RBAC) system. This service is part of the Smart Solutions SMS (SSMS) platform.

**Key Features:**
- User CRUD operations with soft delete support
- Role and Permission management
- Role-Permission assignment
- Standardized API responses
- Comprehensive validation
- CORS enabled for cross-origin requests

---

## Configuration

### Server Configuration
- **Port:** 8081
- **Database:** PostgreSQL (ssms_test)
- **CORS:** Enabled for all origins (`*`)
- **Security:** Currently disabled for testing (all endpoints are publicly accessible)

### Application Properties
```yaml
server:
  port: 8081

spring:
  application:
    name: user-management
  datasource:
    url: jdbc:postgresql://localhost:5432/ssms_test
    username: postgres
    password: sampath123
```

---

## Response Structure

All API endpoints return a standardized response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Response data */ },
  "timestamp": "2026-03-04T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Human-readable message describing the result |
| `data` | object/array/null | The response payload (null for errors) |
| `timestamp` | string (ISO 8601) | Timestamp when the response was generated |

---

## Error Handling

### Error Types

#### 1. Resource Not Found (404)
```json
{
  "success": false,
  "message": "User not found with id: 123",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

#### 2. Duplicate Resource (409)
```json
{
  "success": false,
  "message": "Username already exists",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

#### 3. Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "username": "Username must be between 3 and 80 characters",
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

#### 4. Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error occurred: [error details]",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

## API Endpoints

### User Management

#### 1. Get All Users
Retrieve a list of all users in the system.

**Endpoint:** `GET /api/users`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "userId": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "roleId": 1,
      "roleName": "ADMIN",
      "isActive": true,
      "lastLogin": "2026-03-04T09:30:00",
      "createdAt": "2026-01-01T10:00:00",
      "updatedAt": "2026-03-04T09:30:00",
      "deletedAt": null
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 2. Get User by ID
Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "roleId": 1,
    "roleName": "ADMIN",
    "isActive": true,
    "lastLogin": "2026-03-04T09:30:00",
    "createdAt": "2026-01-01T10:00:00",
    "updatedAt": "2026-03-04T09:30:00",
    "deletedAt": null
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

**Error Response:** 404 Not Found
```json
{
  "success": false,
  "message": "User not found with id: 999",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 3. Create User
Create a new user in the system.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567891",
  "roleId": 2
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Username (3-80 characters) |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Password (min 6 characters) |
| `firstName` | string | No | User's first name |
| `lastName` | string | No | User's last name |
| `phone` | string | No | Phone number |
| `roleId` | integer | Yes | Role ID to assign to user |

**Response:** 201 Created
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 5,
    "username": "jane_smith",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567891",
    "roleId": 2,
    "roleName": "MANAGER",
    "isActive": true,
    "lastLogin": null,
    "createdAt": "2026-03-04T10:30:00",
    "updatedAt": "2026-03-04T10:30:00",
    "deletedAt": null
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

**Error Response:** 409 Conflict (Duplicate Username/Email)
```json
{
  "success": false,
  "message": "Username already exists",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 4. Update User
Update an existing user's information.

**Endpoint:** `PUT /api/users/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID to update |

**Request Body:** (All fields are optional for partial updates)
```json
{
  "username": "jane_smith_updated",
  "email": "jane.updated@example.com",
  "password": "newSecurePassword123",
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "phone": "+1234567892",
  "roleId": 3,
  "isActive": true
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | No | New username (3-80 characters) |
| `email` | string | No | New valid email address |
| `password` | string | No | New password (min 6 characters) |
| `firstName` | string | No | Updated first name |
| `lastName` | string | No | Updated last name |
| `phone` | string | No | Updated phone number |
| `roleId` | integer | No | New role ID |
| `isActive` | boolean | No | User active status |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": 5,
    "username": "jane_smith_updated",
    "email": "jane.updated@example.com",
    "firstName": "Jane",
    "lastName": "Smith-Johnson",
    "phone": "+1234567892",
    "roleId": 3,
    "roleName": "EMPLOYEE",
    "isActive": true,
    "lastLogin": null,
    "createdAt": "2026-03-04T10:30:00",
    "updatedAt": "2026-03-04T11:00:00",
    "deletedAt": null
  },
  "timestamp": "2026-03-04T11:00:00"
}
```

---

#### 5. Delete User (Soft Delete)
Soft delete a user (marks as deleted but keeps in database).

**Endpoint:** `DELETE /api/users/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID to delete |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 6. Hard Delete User
Permanently delete a user from the database.

**Endpoint:** `DELETE /api/users/{id}/hard`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID to permanently delete |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "User permanently deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 7. Update Last Login
Update the last login timestamp for a user.

**Endpoint:** `POST /api/users/{id}/login`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Last login updated successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### Role Management

#### 1. Get All Roles
Retrieve a list of all roles in the system.

**Endpoint:** `GET /api/roles`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "roleId": 1,
      "roleName": "ADMIN",
      "description": "System administrator with full access",
      "createdAt": "2026-01-01T10:00:00",
      "permissions": [
        "USER_READ",
        "USER_CREATE",
        "USER_UPDATE",
        "USER_DELETE"
      ]
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 2. Get Role by ID
Retrieve a specific role by its ID.

**Endpoint:** `GET /api/roles/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Role ID |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "roleId": 1,
    "roleName": "ADMIN",
    "description": "System administrator with full access",
    "createdAt": "2026-01-01T10:00:00",
    "permissions": [
      "USER_READ",
      "USER_CREATE",
      "USER_UPDATE",
      "USER_DELETE"
    ]
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 3. Create Role
Create a new role in the system.

**Endpoint:** `POST /api/roles`

**Request Body:**
```json
{
  "roleName": "MANAGER",
  "description": "Department manager with limited administrative access"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roleName` | string (enum) | Yes | Role name (see RoleName enum) |
| `description` | string | No | Role description |

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "roleId": 7,
    "roleName": "MANAGER",
    "description": "Department manager with limited administrative access",
    "createdAt": "2026-03-04T10:30:00",
    "permissions": []
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 4. Update Role
Update an existing role.

**Endpoint:** `PUT /api/roles/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Role ID to update |

**Request Body:**
```json
{
  "roleName": "MANAGER",
  "description": "Updated description for manager role"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "roleId": 7,
    "roleName": "MANAGER",
    "description": "Updated description for manager role",
    "createdAt": "2026-03-04T10:30:00",
    "permissions": []
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 5. Delete Role
Delete a role from the system.

**Endpoint:** `DELETE /api/roles/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Role ID to delete |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 6. Assign Permission to Role
Assign a permission to a role.

**Endpoint:** `POST /api/roles/{roleId}/permissions/{permissionId}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | integer | Yes | Role ID |
| `permissionId` | integer | Yes | Permission ID to assign |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `grantedBy` | integer | No | User ID who granted the permission |

**Example:** `POST /api/roles/2/permissions/5?grantedBy=1`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permission assigned to role successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 7. Remove Permission from Role
Remove a permission from a role.

**Endpoint:** `DELETE /api/roles/{roleId}/permissions/{permissionId}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | integer | Yes | Role ID |
| `permissionId` | integer | Yes | Permission ID to remove |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permission removed from role successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 8. Get Permissions for Role
Get all permissions assigned to a specific role.

**Endpoint:** `GET /api/roles/{roleId}/permissions`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | integer | Yes | Role ID |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    "USER_READ",
    "USER_CREATE",
    "USER_UPDATE"
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

### Permission Management

#### 1. Get All Permissions
Retrieve a list of all permissions in the system.

**Endpoint:** `GET /api/permissions`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "permissionId": 1,
      "permissionName": "USER_READ",
      "module": "USER",
      "action": "READ"
    },
    {
      "permissionId": 2,
      "permissionName": "USER_CREATE",
      "module": "USER",
      "action": "CREATE"
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 2. Get Permission by ID
Retrieve a specific permission by its ID.

**Endpoint:** `GET /api/permissions/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Permission ID |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permission retrieved successfully",
  "data": {
    "permissionId": 1,
    "permissionName": "USER_READ",
    "module": "USER",
    "action": "READ"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 3. Get Permissions by Module
Retrieve all permissions for a specific module.

**Endpoint:** `GET /api/permissions/module/{module}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module` | string | Yes | Module name (e.g., "USER", "PRODUCT") |

**Example:** `GET /api/permissions/module/USER`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "permissionId": 1,
      "permissionName": "USER_READ",
      "module": "USER",
      "action": "READ"
    },
    {
      "permissionId": 2,
      "permissionName": "USER_CREATE",
      "module": "USER",
      "action": "CREATE"
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 4. Get Permissions by Action
Retrieve all permissions for a specific action type.

**Endpoint:** `GET /api/permissions/action/{action}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string (enum) | Yes | Action type (see Action enum) |

**Example:** `GET /api/permissions/action/READ`

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "permissionId": 1,
      "permissionName": "USER_READ",
      "module": "USER",
      "action": "READ"
    },
    {
      "permissionId": 5,
      "permissionName": "PRODUCT_READ",
      "module": "PRODUCT",
      "action": "READ"
    }
  ],
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 5. Create Permission
Create a new permission in the system.

**Endpoint:** `POST /api/permissions`

**Request Body:**
```json
{
  "permissionName": "PRODUCT_CREATE",
  "module": "PRODUCT",
  "action": "CREATE"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `permissionName` | string | Yes | Unique permission name |
| `module` | string | No | Module/feature area (e.g., "USER", "PRODUCT") |
| `action` | string (enum) | No | Action type (see Action enum) |

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permissionId": 15,
    "permissionName": "PRODUCT_CREATE",
    "module": "PRODUCT",
    "action": "CREATE"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 6. Update Permission
Update an existing permission.

**Endpoint:** `PUT /api/permissions/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Permission ID to update |

**Request Body:**
```json
{
  "permissionName": "PRODUCT_CREATE_ADVANCED",
  "module": "PRODUCT",
  "action": "CREATE"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permissionId": 15,
    "permissionName": "PRODUCT_CREATE_ADVANCED",
    "module": "PRODUCT",
    "action": "CREATE"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

---

#### 7. Delete Permission
Delete a permission from the system.

**Endpoint:** `DELETE /api/permissions/{id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Permission ID to delete |

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": null,
  "timestamp": "2026-03-04T10:30:00"
}
```

---

## Data Models

### UserRequestDTO
Used for creating new users.

```typescript
interface UserRequestDTO {
  username: string;      // Required, 3-80 chars
  email: string;         // Required, valid email
  password: string;      // Required, min 6 chars
  firstName?: string;    // Optional
  lastName?: string;     // Optional
  phone?: string;        // Optional
  roleId: number;        // Required
}
```

### UserUpdateDTO
Used for updating existing users (all fields optional).

```typescript
interface UserUpdateDTO {
  username?: string;     // Optional, 3-80 chars
  email?: string;        // Optional, valid email
  password?: string;     // Optional, min 6 chars
  firstName?: string;    // Optional
  lastName?: string;     // Optional
  phone?: string;        // Optional
  roleId?: number;       // Optional
  isActive?: boolean;    // Optional
}
```

### UserResponseDTO
Returned when retrieving user information.

```typescript
interface UserResponseDTO {
  userId: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  roleId: number;
  roleName: string;
  isActive: boolean;
  lastLogin: string | null;      // ISO 8601 format
  createdAt: string;              // ISO 8601 format
  updatedAt: string;              // ISO 8601 format
  deletedAt: string | null;       // ISO 8601 format
}
```

### RoleRequestDTO
Used for creating/updating roles.

```typescript
interface RoleRequestDTO {
  roleName: RoleName;    // Required, enum value
  description?: string;  // Optional
}
```

### RoleResponseDTO
Returned when retrieving role information.

```typescript
interface RoleResponseDTO {
  roleId: number;
  roleName: string;
  description: string | null;
  createdAt: string;          // ISO 8601 format
  permissions: string[];      // Array of permission names
}
```

### PermissionRequestDTO
Used for creating/updating permissions.

```typescript
interface PermissionRequestDTO {
  permissionName: string;  // Required
  module?: string;         // Optional
  action?: Action;         // Optional, enum value
}
```

### PermissionResponseDTO
Returned when retrieving permission information.

```typescript
interface PermissionResponseDTO {
  permissionId: number;
  permissionName: string;
  module: string | null;
  action: string | null;
}
```

### ApiResponse<T>
Generic wrapper for all API responses.

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;  // ISO 8601 format
}
```

---

## Enumerations

### RoleName
Available role types in the system.

```typescript
enum RoleName {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  CUSTOMER = "CUSTOMER",
  SUPPLIER = "SUPPLIER",
  TECHNICIAN = "TECHNICIAN"
}
```

**Usage in JSON:**
```json
{
  "roleName": "ADMIN"
}
```

### Action
Available permission action types.

```typescript
enum Action {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXECUTE = "EXECUTE",
  MANAGE = "MANAGE"
}
```

**Usage in JSON:**
```json
{
  "action": "READ"
}
```

---

## Validation Rules

### User Validation

| Field | Validation Rules |
|-------|-----------------|
| `username` | Required, 3-80 characters, unique |
| `email` | Required, valid email format, unique |
| `password` | Required for creation, min 6 characters |
| `firstName` | Optional, string |
| `lastName` | Optional, string |
| `phone` | Optional, string |
| `roleId` | Required, must reference existing role |
| `isActive` | Optional, boolean |

### Role Validation

| Field | Validation Rules |
|-------|-----------------|
| `roleName` | Required, must be valid RoleName enum value, unique |
| `description` | Optional, text |

### Permission Validation

| Field | Validation Rules |
|-------|-----------------|
| `permissionName` | Required, max 100 characters, unique |
| `module` | Optional, max 50 characters |
| `action` | Optional, must be valid Action enum value |

---

## HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 OK | Success | GET, PUT, DELETE requests |
| 201 Created | Resource created | POST requests |
| 400 Bad Request | Validation error | Invalid request data |
| 404 Not Found | Resource not found | Invalid ID in path |
| 409 Conflict | Duplicate resource | Username/email already exists |
| 500 Internal Server Error | Server error | Unexpected errors |

---

## Examples

### Example 1: Complete User Registration Flow

```javascript
// Step 1: Get available roles
fetch('http://localhost:8081/api/roles')
  .then(res => res.json())
  .then(response => {
    console.log('Available roles:', response.data);
    // Output: [{roleId: 1, roleName: "ADMIN", ...}, ...]
  });

// Step 2: Create a new user
const newUser = {
  username: "alice_wonder",
  email: "alice@example.com",
  password: "securePass123",
  firstName: "Alice",
  lastName: "Wonder",
  phone: "+1234567890",
  roleId: 2  // MANAGER role
};

fetch('http://localhost:8081/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
})
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      console.log('User created:', response.data);
      // Output: {userId: 10, username: "alice_wonder", ...}
    } else {
      console.error('Error:', response.message);
    }
  });
```

### Example 2: Update User Information

```javascript
const userId = 10;
const updates = {
  firstName: "Alice",
  lastName: "Wonderland",
  phone: "+1987654321"
};

fetch(`http://localhost:8081/api/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updates)
})
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      console.log('User updated:', response.data);
    }
  });
```

### Example 3: Role-Permission Management

```javascript
// Create a new permission
const newPermission = {
  permissionName: "INVOICE_CREATE",
  module: "INVOICE",
  action: "CREATE"
};

fetch('http://localhost:8081/api/permissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newPermission)
})
  .then(res => res.json())
  .then(response => {
    const permissionId = response.data.permissionId;
    
    // Assign permission to role
    const roleId = 2; // MANAGER role
    const grantedBy = 1; // ADMIN user
    
    return fetch(
      `http://localhost:8081/api/roles/${roleId}/permissions/${permissionId}?grantedBy=${grantedBy}`,
      { method: 'POST' }
    );
  })
  .then(res => res.json())
  .then(response => {
    console.log('Permission assigned:', response.message);
  });
```

### Example 4: Error Handling

```javascript
async function createUser(userData) {
  try {
    const response = await fetch('http://localhost:8081/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      // Handle different error types
      if (response.status === 400 && result.data) {
        // Validation errors
        console.error('Validation errors:', result.data);
        // Display field-specific errors to user
        Object.keys(result.data).forEach(field => {
          console.log(`${field}: ${result.data[field]}`);
        });
      } else if (response.status === 409) {
        // Duplicate resource
        console.error('Duplicate:', result.message);
      } else {
        // Other errors
        console.error('Error:', result.message);
      }
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Usage
const userData = {
  username: "bob",  // Too short! Will trigger validation error
  email: "invalid-email",  // Invalid format!
  password: "123",  // Too short!
  roleId: 2
};

createUser(userData);
// Output:
// username: Username must be between 3 and 80 characters
// email: Email should be valid
// password: Password must be at least 6 characters
```

### Example 5: React/TypeScript Integration

```typescript
import React, { useState, useEffect } from 'react';

interface User {
  userId: number;
  username: string;
  email: string;
  roleName: string;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users');
      const result: ApiResponse<User[]> = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/users/${userId}`,
        { method: 'DELETE' }
      );
      const result: ApiResponse<null> = await response.json();
      
      if (result.success) {
        // Refresh user list
        fetchUsers();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roleName}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => deleteUser(user.userId)}>
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

export default UserList;
```

### Example 6: Axios Integration

```javascript
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data.message);
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// User service
const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  updateLastLogin: async (id) => {
    const response = await api.post(`/api/users/${id}/login`);
    return response.data;
  }
};

// Usage
async function example() {
  try {
    // Get all users
    const usersResponse = await userService.getAllUsers();
    console.log('Users:', usersResponse.data);

    // Create user
    const newUserResponse = await userService.createUser({
      username: "charlie_brown",
      email: "charlie@example.com",
      password: "securePass123",
      roleId: 3
    });
    console.log('Created user:', newUserResponse.data);

    // Update user
    const updatedUserResponse = await userService.updateUser(
      newUserResponse.data.userId,
      { firstName: "Charlie", lastName: "Brown" }
    );
    console.log('Updated user:', updatedUserResponse.data);

  } catch (error) {
    console.error('Operation failed:', error);
  }
}
```

---

## Testing the API

### Using cURL

```bash
# Get all users
curl -X GET http://localhost:8081/api/users

# Get user by ID
curl -X GET http://localhost:8081/api/users/1

# Create user
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "password123",
    "roleId": 2
  }'

# Update user
curl -X PUT http://localhost:8081/api/users/5 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'

# Delete user
curl -X DELETE http://localhost:8081/api/users/5

# Assign permission to role
curl -X POST "http://localhost:8081/api/roles/2/permissions/3?grantedBy=1"

# Get permissions for role
curl -X GET http://localhost:8081/api/roles/2/permissions
```

### Using Postman

1. **Import Collection**: Create a new collection named "User Management API"
2. **Set Base URL**: Create an environment variable `base_url` = `http://localhost:8081`
3. **Add Requests**: Create requests for each endpoint
4. **Test Scripts**: Add test scripts to validate responses

Example Postman test script:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

---

## Common Frontend Tasks

### 1. User Login Tracking
After a successful login in your frontend:
```javascript
async function handleSuccessfulLogin(userId) {
  try {
    await fetch(`http://localhost:8081/api/users/${userId}/login`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Failed to update login time:', error);
  }
}
```

### 2. User Registration Form
```javascript
async function handleUserRegistration(formData) {
  const userData = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    roleId: parseInt(formData.role)
  };

  try {
    const response = await fetch('http://localhost:8081/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (!result.success) {
      // Handle validation errors
      if (result.data) {
        return { errors: result.data };
      }
      return { error: result.message };
    }

    return { user: result.data };
  } catch (error) {
    return { error: 'Registration failed' };
  }
}
```

### 3. Role-Based UI Rendering
```javascript
async function getUserPermissions(userId) {
  try {
    // Get user details
    const userResponse = await fetch(`http://localhost:8081/api/users/${userId}`);
    const userResult = await userResponse.json();
    
    if (!userResult.success) return [];

    const roleId = userResult.data.roleId;

    // Get role permissions
    const permResponse = await fetch(`http://localhost:8081/api/roles/${roleId}/permissions`);
    const permResult = await permResponse.json();

    return permResult.success ? permResult.data : [];
  } catch (error) {
    console.error('Failed to get permissions:', error);
    return [];
  }
}

// Use in your UI
async function renderMenu(userId) {
  const permissions = await getUserPermissions(userId);
  
  // Show/hide menu items based on permissions
  if (permissions.includes('USER_CREATE')) {
    // Show "Add User" button
  }
  if (permissions.includes('USER_DELETE')) {
    // Show "Delete User" button
  }
}
```

### 4. Dropdown Population
```javascript
async function populateRoleDropdown() {
  try {
    const response = await fetch('http://localhost:8081/api/roles');
    const result = await response.json();

    if (result.success) {
      const select = document.getElementById('roleSelect');
      result.data.forEach(role => {
        const option = document.createElement('option');
        option.value = role.roleId;
        option.textContent = role.roleName;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Failed to load roles:', error);
  }
}
```

---

## Best Practices

### 1. Error Handling
Always check the `success` field in responses:
```javascript
const result = await fetch(url).then(r => r.json());
if (!result.success) {
  handleError(result.message, result.data);
}
```

### 2. Loading States
Implement loading indicators for async operations:
```javascript
setLoading(true);
try {
  const result = await fetchData();
  setData(result.data);
} finally {
  setLoading(false);
}
```

### 3. Validation
Validate data on frontend before sending:
```javascript
function validateUserForm(data) {
  const errors = {};
  
  if (!data.username || data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
```

### 4. Caching
Consider caching frequently accessed data like roles:
```javascript
let rolesCache = null;
let rolesCacheTime = null;

async function getRoles(forceRefresh = false) {
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  if (!forceRefresh && rolesCache && 
      Date.now() - rolesCacheTime < CACHE_DURATION) {
    return rolesCache;
  }
  
  const response = await fetch('http://localhost:8081/api/roles');
  const result = await response.json();
  
  if (result.success) {
    rolesCache = result.data;
    rolesCacheTime = Date.now();
  }
  
  return rolesCache;
}
```

---

## Notes

1. **Security**: The API currently has security disabled for testing. In production, implement proper JWT/OAuth authentication.

2. **CORS**: CORS is enabled for all origins (`*`). In production, restrict to specific origins.

3. **Timestamps**: All timestamps are in ISO 8601 format (e.g., `2026-03-04T10:30:00`).

4. **Soft Delete**: Deleted users remain in the database with `deletedAt` timestamp. Use hard delete for permanent removal.

5. **Password Storage**: Passwords should be hashed before storage (ensure backend implements this).

6. **Pagination**: Current API returns all records. Consider implementing pagination for large datasets.

7. **Rate Limiting**: No rate limiting is currently implemented. Consider adding in production.

---

## Support

For questions or issues regarding this API, please contact the development team.

**API Version:** 1.0  
**Last Updated:** March 4, 2026  
**Maintained By:** SSMS Development Team
