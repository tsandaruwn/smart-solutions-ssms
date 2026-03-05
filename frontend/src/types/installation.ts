// ====================================
// INSTALLATION MANAGEMENT TYPES
// Created by: [Your Name]
// Purpose: Type definitions for installation management system
// ====================================

export enum InstallationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  OFF = 'OFF',
  ON_JOB = 'ON_JOB'
}

export interface Installation {
  id: number;
  jobReference: string;
  orderId: number;
  customerId: number;
  technicianId: number;
  scheduledByUserId?: number;
  scheduledDate: string;
  completedDate?: string;
  installationAddress: string;
  status: InstallationStatus;
  technicianNotes?: string;
  cancellationReason?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: number;
  userId: number;
  specialization: string;
  certificationNumber: string;
  availabilityStatus: AvailabilityStatus;
  phone?: string;
  hiredDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstallationRequest {
  jobReference: string;
  orderId: number;
  customerId: number;
  technicianId: number;
  scheduledDate: string;
  installationAddress: string;
  technicianNotes?: string;
}

export interface UpdateInstallationRequest {
  jobReference?: string;
  orderId?: number;
  customerId?: number;
  technicianId?: number;
  scheduledDate?: string;
  installationAddress?: string;
  technicianNotes?: string;
}

export interface StatusUpdateRequest {
  status: InstallationStatus;
  technicianNotes?: string;
  cancellationReason?: string;
}

export interface TechnicianAssignmentRequest {
  technicianId: number;
}