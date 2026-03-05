// ====================================
// INSTALLATION MODAL COMPONENT
// Created by: [Your Name]
// Purpose: Create and edit installation form in a modal dialog
// ====================================

import { useState } from "react";
import { X, Save } from "lucide-react";
import { installationApi } from "@/lib/installationApi";
import type { Installation, CreateInstallationRequest } from "@/types/installation";

interface InstallationModalProps {
  installation: Installation | null;
  onClose: () => void;
  onSave: () => void;
}

export default function InstallationModal({ installation, onClose, onSave }: InstallationModalProps) {
  const isEditMode = !!installation;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobReference: installation?.jobReference || "",
    orderId: installation?.orderId || 0,
    customerId: installation?.customerId || 0,
    technicianId: installation?.technicianId || 0,
    scheduledDate: installation?.scheduledDate ? new Date(installation.scheduledDate).toISOString().slice(0, 16) : "",
    installationAddress: installation?.installationAddress || "",
    technicianNotes: installation?.technicianNotes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        throw new Error("Update not implemented in backend");
      } else {
        const createData: CreateInstallationRequest = {
          jobReference: formData.jobReference,
          orderId: formData.orderId,
          customerId: formData.customerId,
          technicianId: formData.technicianId,
          scheduledDate: formData.scheduledDate,
          installationAddress: formData.installationAddress,
          technicianNotes: formData.technicianNotes,
        };
        await installationApi.scheduleInstallation(createData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600, width: "100%" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-navy mb-1" style={{ fontSize: "1.25rem" }}>
              {isEditMode ? "Edit Installation" : "Schedule Installation"}
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
          <div className="row g-3 mb-4">
            {/* Job Reference */}
            <div className="col-12">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Job Reference *
              </label>
              <input
                type="text"
                name="jobReference"
                value={formData.jobReference}
                onChange={handleChange}
                className="input-brand"
                required
                maxLength={30}
              />
            </div>

            {/* Order ID */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Order ID *
              </label>
              <input
                type="number"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                className="input-brand"
                required
                min={1}
              />
            </div>

            {/* Customer ID */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Customer ID *
              </label>
              <input
                type="number"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="input-brand"
                required
                min={1}
              />
            </div>

            {/* Technician ID */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Technician ID *
              </label>
              <input
                type="number"
                name="technicianId"
                value={formData.technicianId}
                onChange={handleChange}
                className="input-brand"
                required
                min={1}
              />
            </div>

            {/* Scheduled Date */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Scheduled Date *
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="input-brand"
                required
              />
            </div>

            {/* Installation Address */}
            <div className="col-12">
              <label className="form-label fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                Installation Address *
              </label>
              <textarea
                name="installationAddress"
                value={formData.installationAddress}
                onChange={handleChange}
                className="textarea-brand"
                required
                rows={2}
              />
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
              />
            </div>
          </div>

          {/* Footer */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-amber d-flex align-items-center gap-2" disabled={loading}>
              <Save size={16} />
              <span>{loading ? "Saving..." : isEditMode ? "Update" : "Schedule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}