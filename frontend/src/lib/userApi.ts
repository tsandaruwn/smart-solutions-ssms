// ====================================
// USER MANAGEMENT API
// Purpose: API utilities for user management operations
// Proxied via Next.js rewrites → localhost:8081
// ====================================

import type { User, CreateUserRequest, UpdateUserRequest, Role, ApiResponse } from "@/types/user";

const BASE_URL = "/api";

class UserManagementAPI {
  // ============ USER ENDPOINTS ============
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const result: ApiResponse<User[]> = await response.json();
    return result.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }
    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user");
    }
    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  }

  async updateLastLogin(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}/login`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to update last login");
  }

  // ============ ROLE ENDPOINTS ============
  async getAllRoles(): Promise<Role[]> {
    const response = await fetch(`${BASE_URL}/roles`);
    if (!response.ok) throw new Error("Failed to fetch roles");
    const result: ApiResponse<Role[]> = await response.json();
    return result.data;
  }

  async getRoleById(id: number): Promise<Role> {
    const response = await fetch(`${BASE_URL}/roles/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch role ${id}`);
    const result: ApiResponse<Role> = await response.json();
    return result.data;
  }
}

export const userApi = new UserManagementAPI();
