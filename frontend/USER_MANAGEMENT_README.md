# User Management Module Documentation

## 🎨 Color Palette
This module uses the following color scheme:
- **Navy Blue**: `#1A3263` - Primary color for headers and text
- **Slate Blue**: `#547792` - Secondary color for accents and borders  
- **Orange/Gold**: `#FAB95B` - Accent color for buttons and highlights
- **Cream/Beige**: `#E8E2DB` - Background color

## 📁 Files Created

### 1. Type Definitions
**File:** `src/types/user.ts`
- User interface
- CreateUserRequest interface
- UpdateUserRequest interface
- Role interface
- ApiResponse interface

### 2. API Utilities
**File:** `src/lib/userApi.ts`
- User CRUD operations
- Role management operations
- API base URL: `http://localhost:8081/api`

### 3. Login Page
**File:** `src/app/login/page.tsx`
- User authentication interface
- Form validation
- Integration with user API
- Last login tracking
- Responsive design with custom styling

### 4. User Management Dashboard
**File:** `src/app/dashboard/users/page.tsx`
- Complete user management interface
- User statistics cards (Total, Active, Inactive, Admins)
- Search functionality
- Create/Edit/Delete operations
- Refresh functionality

### 5. User Table Component
**File:** `src/components/user/UserTable.tsx`
- Displays users in a formatted table
- Status badges (Active/Inactive)
- Role badges
- Edit and Delete action buttons
- Date formatting

### 6. User Modal Component
**File:** `src/components/user/UserModal.tsx`
- Form for creating new users
- Form for editing existing users
- Role selection dropdown
- Form validation
- Error handling

### 7. Navigation Integration
**File:** `src/components/layout/Sidebar.tsx` (Modified)
- Added "User Management" link to sidebar navigation
- Icon: UserCog
- Route: `/dashboard/users`

## 🔑 Key Features

### Login System
- Username/password authentication
- User validation against backend
- Last login timestamp update
- Session storage (localStorage)
- Error handling and feedback

### User Management Dashboard
- **View Users**: Display all users with search and filter
- **Create User**: Add new users with role assignment
- **Edit User**: Update user information and status
- **Delete User**: Soft delete users
- **Statistics**: Real-time user metrics
- **Search**: Filter by username, email, name, or role
- **Responsive Design**: Works on all screen sizes

## 🎯 API Endpoints Used

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (soft delete)
- `POST /api/users/{id}/login` - Update last login

### Role Endpoints
- `GET /api/roles` - Get all roles
- `GET /api/roles/{id}` - Get role by ID

## 📋 Usage Instructions

### Access Login Page
Navigate to: `/login`

### Access User Management
1. Login with valid credentials
2. Click "User Management" in the sidebar
3. Or navigate to: `/dashboard/users`

### Create a New User
1. Click "Create User" button
2. Fill in required fields:
   - Username (3-80 characters)
   - Email (valid email format)
   - Password (min 6 characters)
   - Role (select from dropdown)
3. Optionally fill: First Name, Last Name, Phone
4. Click "Create User"

### Edit a User
1. Click the edit (pencil) icon on any user row
2. Modify the desired fields
3. Leave password blank to keep current password
4. Toggle "Active User" checkbox to change status
5. Click "Update User"

### Delete a User
1. Click the delete (trash) icon on any user row
2. Confirm the deletion in the dialog
3. User will be soft-deleted

### Search Users
Type in the search box to filter users by:
- Username
- Email
- First Name
- Last Name
- Role Name

## 🎭 Developer Identification

All files created by this module include:
- Header comments with "Created by: [Your Name]"
- Color palette documentation
- Purpose description
- Developer signature at bottom of pages (where applicable)

Look for these identifiers:
- 🔐 Login Module signature
- 👤 User Management Module signature
- Comment: "USER MANAGEMENT MODULE - Created by [Your Name]"

## 🚀 Backend Requirements

Ensure the backend server is running:
- **URL**: `http://localhost:8081`
- **Database**: PostgreSQL (ssms_test)
- **CORS**: Enabled for frontend requests

## 📝 Notes

- Password is hashed on backend (currently uses plain text in demo)
- Session management uses localStorage (upgrade to secure token auth in production)
- Soft delete is used for user deletion (preserves data)
- All timestamps are in ISO 8601 format
- Role permissions are managed on backend

## 🔮 Future Enhancements

Potential improvements:
- JWT authentication
- Password recovery/reset
- User profile page
- Activity logs
- Advanced filtering and sorting
- Bulk user operations
- Export user data
- Role permissions management UI

---

**Module Created By:** [Your Name]  
**Date:** March 4, 2026  
**Version:** 1.0
