// ====================================
// INSTALLATION MANAGEMENT API
// Created by: [Your Name]
// Purpose: API utilities for installation management operations
// Base URL: http://localhost:8083
// ====================================

import type {
  Installation,
  Technician,
  CreateInstallationRequest,
  UpdateInstallationRequest,
  StatusUpdateRequest,
  TechnicianAssignmentRequest,
  InstallationStatus
} from "@/types/installation";

const BASE_URL = "http://localhost:8083/api";

class InstallationManagementAPI {
  // ============ INSTALLATION ENDPOINTS ============
  async getAllInstallations(): Promise<Installation[]> {
    const response = await fetch(`${BASE_URL}/installations`);
    if (!response.ok) throw new Error("Failed to fetch installations");
    return response.json();
  }

  async getInstallationById(id: number): Promise<Installation> {
    const response = await fetch(`${BASE_URL}/installations/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch installation ${id}`);
    return response.json();
  }

  async scheduleInstallation(installationData: CreateInstallationRequest): Promise<Installation> {
    const response = await fetch(`${BASE_URL}/installations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(installationData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to schedule installation");
    }
    return response.json();
  }

  async assignTechnician(id: number, assignmentData: TechnicianAssignmentRequest): Promise<Installation> {
    const response = await fetch(`${BASE_URL}/installations/${id}/assign-technician`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignmentData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to assign technician");
    }
    return response.json();
  }

  async updateInstallationStatus(id: number, statusData: StatusUpdateRequest): Promise<Installation> {
    const response = await fetch(`${BASE_URL}/installations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update status");
    }
    return response.json();
  }

  async cancelInstallation(id: number): Promise<Installation> {
    const response = await fetch(`${BASE_URL}/installations/${id}/cancel`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to cancel installation");
    return response.json();
  }

  async deleteInstallation(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/installations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete installation");
  }

  async getInstallationsByStatus(status: InstallationStatus): Promise<Installation[]> {
    const response = await fetch(`${BASE_URL}/installations/status/${status}`);
    if (!response.ok) throw new Error("Failed to fetch installations by status");
    return response.json();
  }

  async getInstallationsByTechnician(technicianId: number): Promise<Installation[]> {
    const response = await fetch(`${BASE_URL}/installations/technician/${technicianId}`);
    if (!response.ok) throw new Error("Failed to fetch installations by technician");
    return response.json();
  }

  // Note: Technician endpoints might be in user-management or separate
  // For now, assuming they are not available, or we can add if needed
}

export const installationApi = new InstallationManagementAPI();