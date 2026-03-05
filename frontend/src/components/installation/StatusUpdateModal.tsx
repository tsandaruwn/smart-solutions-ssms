// ====================================
// STATUS UPDATE MODAL COMPONENT
// Created by: [Your Name]
// Purpose: Update installation status in a modal dialog
// ====================================

import { useState } from "react";
import { X, Save } from "lucide-react";
import { installationApi } from "@/lib/installationApi";
import type { Installation, StatusUpdateRequest } from "@/types/installation";
import { InstallationStatus } from "@/types/installation";

interface StatusUpdateModalProps {
  installation: Installation;
  onClose: () => void;
  onSave: () => void;
}

export default function StatusUpdateModal({ installation, onClose, onSave }: StatusUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: installation.status,
    technicianNotes: installation.technicianNotes || "",
    cancellationReason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: StatusUpdateRequest = {
        status: formData.status,
        technicianNotes: formData.technicianNotes,
      };

      if (formData.status === InstallationStatus.CANCELLED && formData.cancellationReason) {
        updateData.cancellationReason = formData.cancellationReason;
      }

      await installationApi.updateInstallationStatus(installation.id, updateData);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-navy mb-1" style={{ fontSize: "1.25rem" }}>
              Update Status
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ color: "var(--navy)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="warning-banner mb-4">
            <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
            <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Installation Info */}
          <div className="bg-navy-subtle p-3 rounded-3 mb-4" style={{ fontSize: ".875rem" }}>
            <p className="mb-2">
              <span className="text-muted-brand fw-semibold">Job Reference:</span>{" "}
              <span className="text-navy fw-semibold">{installation.jobReference}</span>
            </p>
            <p className="mb-0">
              <span className="text-muted-brand fw-semibold">Current Status:</span>{" "}
              <span className="text-navy fw-semibold">{installation.status.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="row g-3 mb-4">
            {/* Status */}
            <div className="col-12">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                New Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-brand"
                required
              >
                <option value={InstallationStatus.SCHEDULED}>Scheduled</option>
                <option value={InstallationStatus.IN_PROGRESS}>In Progress</option>
                <option value={InstallationStatus.COMPLETED}>Completed</option>
                <option value={InstallationStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Technician Notes */}
            <div className="col-12">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Technician Notes
              </label>
              <textarea
                name="technicianNotes"
                value={formData.technicianNotes}
                onChange={handleChange}
                className="textarea-brand"
                rows={2}
                placeholder="Add any notes about the installation..."
              />
            </div>

            {/* Cancellation Reason */}
            {formData.status === InstallationStatus.CANCELLED && (
              <div className="col-12">
                <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                  Cancellation Reason *
                </label>
                <textarea
                  name="cancellationReason"
                  value={formData.cancellationReason}
                  onChange={handleChange}
                  className="textarea-brand"
                  rows={2}
                  required
                  placeholder="Reason for cancellation..."
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-amber d-flex align-items-center gap-2" disabled={loading}>
              <Save size={16} />
              <span>{loading ? "Updating..." : "Update Status"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}