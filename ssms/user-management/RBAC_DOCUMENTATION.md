# User Management RBAC System

This User Management system has been restructured to implement a comprehensive Role-Based Access Control (RBAC) architecture.

## Database Schema

### Core Tables

#### 1. USER Table
- **user_id** (PK, INT, AUTO_INCREMENT): Unique identifier for each user
- **role_id** (FK, INT): Foreign key reference to ROLE table
- **email** (UNIQUE, VARCHAR(150)): User's email address
- **username** (UNIQUE, VARCHAR(80)): User's username
- **password_hash** (VARCHAR(255)): Hashed password
- **first_name** (VARCHAR(80)): User's first name
- **last_name** (VARCHAR(80)): User's last name
- **phone** (VARCHAR(20)): Phone number
- **is_active** (BOOLEAN, DEFAULT TRUE): Account active status
- **last_login** (TIMESTAMP): Last login timestamp
- **created_at** (TIMESTAMP): Account creation timestamp
- **updated_at** (TIMESTAMP): Last update timestamp
- **deleted_at** (TIMESTAMP): Soft delete timestamp (NULL if not deleted)

#### 2. ROLE Table
- **role_id** (PK, INT, AUTO_INCREMENT): Unique identifier for each role
- **role_name** (UNIQUE, ENUM): Role name (ADMIN, MANAGER, EMPLOYEE, CUSTOMER, SUPPLIER, TECHNICIAN)
- **description** (TEXT): Role description
- **created_at** (TIMESTAMP): Role creation timestamp

#### 3. PERMISSION Table
- **permission_id** (PK, INT, AUTO_INCREMENT): Unique identifier for each permission
- **permission_name** (UNIQUE, VARCHAR(100)): Permission name
- **module** (VARCHAR(50)): Module name
- **action** (ENUM): Action type (CREATE, READ, UPDATE, DELETE, EXECUTE, MANAGE)

#### 4. ROLE_PERMISSION Table (Junction)
- **role_id** (FK, INT): Foreign key to ROLE
- **permission_id** (FK, INT): Foreign key to PERMISSION
- **granted_at** (TIMESTAMP): Timestamp when permission was granted
- **granted_by** (INT): User ID who granted the permission
- **Primary Key**: (role_id, permission_id)

## Default Roles and Permissions

### Roles:
1. **ADMIN**: Full system access
2. **MANAGER**: User management and read-only role/permission access
3. **EMPLOYEE**: Read-only access
4. **CUSTOMER**: Limited read access (own profile)
5. **SUPPLIER**: Read and update own profile
6. **TECHNICIAN**: Read all, update users

### Permission Modules:
- **USER_MANAGEMENT**: Create, Read, Update, Delete, Manage users
- **ROLE_MANAGEMENT**: Create, Read, Update, Delete, Manage roles
- **PERMISSION_MANAGEMENT**: Create, Read, Update, Delete, Manage permissions

## API Endpoints

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Soft delete user
- `DELETE /api/users/{id}/hard` - Permanently delete user
- `POST /api/users/{id}/login` - Update last login timestamp

### Role Management
- `GET /api/roles` - Get all roles
- `GET /api/roles/{id}` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role
- `POST /api/roles/{roleId}/permissions/{permissionId}` - Assign permission to role
- `DELETE /api/roles/{roleId}/permissions/{permissionId}` - Remove permission from role
- `GET /api/roles/{roleId}/permissions` - Get all permissions for a role

### Permission Management
- `GET /api/permissions` - Get all permissions
- `GET /api/permissions/{id}` - Get permission by ID
- `GET /api/permissions/module/{module}` - Get permissions by module
- `GET /api/permissions/action/{action}` - Get permissions by action
- `POST /api/permissions` - Create new permission
- `PUT /api/permissions/{id}` - Update permission
- `DELETE /api/permissions/{id}` - Delete permission

## Request/Response DTOs

### UserRequestDTO
```json
{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roleId": 1
}
```

### UserResponseDTO
```json
{
  "userId": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roleId": 1,
  "roleName": "ADMIN",
  "isActive": true,
  "lastLogin": "2026-03-01T10:30:00",
  "createdAt": "2026-01-15T08:00:00",
  "updatedAt": "2026-03-01T10:30:00",
  "deletedAt": null
}
```

### RoleRequestDTO
```json
{
  "roleName": "ADMIN",
  "description": "System administrator with full access"
}
```

### RoleResponseDTO
```json
{
  "roleId": 1,
  "roleName": "ADMIN",
  "description": "System administrator with full access",
  "createdAt": "2026-01-01T00:00:00",
  "permissions": ["USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE"]
}
```

### PermissionRequestDTO
```json
{
  "permissionName": "USER_CREATE",
  "module": "USER_MANAGEMENT",
  "action": "CREATE"
}
```

### PermissionResponseDTO
```json
{
  "permissionId": 1,
  "permissionName": "USER_CREATE",
  "module": "USER_MANAGEMENT",
  "action": "CREATE"
}
```

## Features

### Soft Delete
Users can be soft deleted using the `DELETE /api/users/{id}` endpoint. This sets the `deleted_at` timestamp and marks `is_active` as false. Soft-deleted users are excluded from regular queries.

### Last Login Tracking
The system tracks the last login timestamp for each user. Use the `POST /api/users/{id}/login` endpoint to update this.

### Flexible Role-Permission Assignment
Permissions can be dynamically assigned to or removed from roles through the API endpoints.

## Default Admin User
- **Email**: admin@ssms.com
- **Username**: admin
- **Password**: admin123 (Change immediately in production!)

## Database Initialization
Run the `schema.sql` file to create tables and populate default data:
```bash
mysql -u root -p your_database < src/main/resources/schema.sql
```

Or configure Spring Boot to run it automatically by adding to `application.yaml`:
```yaml
spring:
  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
```

## Entity Relationships
- User -> Role (Many-to-One)
- Role -> RolePermission (One-to-Many)
- Permission -> RolePermission (One-to-Many)
- Role <-> Permission (Many-to-Many through RolePermission)
