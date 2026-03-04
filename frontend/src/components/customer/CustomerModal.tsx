// ====================================
// CUSTOMER MODAL COMPONENT
// Purpose: Create and edit customer form in a modal dialog
// ====================================

import { useState } from "react";
import { X, Save } from "lucide-react";
import { customerApi } from "@/lib/customerApi";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/types/customer";

interface CustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: () => void;
}

export default function CustomerModal({ customer, onClose, onSave }: CustomerModalProps) {
  const isEditMode = !!customer;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: customer?.email || "",
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    phone: customer?.phone || "",
    addressLine1: customer?.addressLine1 || "",
    addressLine2: customer?.addressLine2 || "",
    city: customer?.city || "",
    state: customer?.state || "",
    country: customer?.country || "",
    postalCode: customer?.postalCode || "",
    dateOfBirth: customer?.dateOfBirth || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      if (isEditMode) {
        const updateData: UpdateCustomerRequest = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          addressLine1: formData.addressLine1 || undefined,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          country: formData.country || undefined,
          postalCode: formData.postalCode || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
        };
        await customerApi.updateCustomer(customer.customerId, updateData);
      } else {
        const createData: CreateCustomerRequest = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          addressLine1: formData.addressLine1 || undefined,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          country: formData.country || undefined,
          postalCode: formData.postalCode || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
        };
        await customerApi.createCustomer(createData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,50,99,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card-brand"
        style={{ maxWidth: 800, width: "100%", maxHeight: "90vh", overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="card-brand-header">
          <span className="fw-semibold text-navy" style={{ fontSize: "1.125rem" }}>
            {isEditMode ? "Edit Customer" : "Create New Customer"}
          </span>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="card-brand-body">
          {error && (
            <div className="warning-banner mb-3">
              <span className="text-amber-dark">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* First Name */}
              <div className="col-12 col-md-6">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="input-brand"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                />
              </div>

              {/* Last Name */}
              <div className="col-12 col-md-6">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="input-brand"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                />
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="input-brand"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                />
              </div>

              {/* Phone */}
              <div className="col-12 col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="input-brand"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>

              {/* Date of Birth */}
              <div className="col-12 col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="input-brand"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Address Line 1 */}
              <div className="col-12">
                <label className="form-label">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  className="input-brand"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  maxLength={200}
                />
              </div>

              {/* Address Line 2 */}
              <div className="col-12">
                <label className="form-label">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  className="input-brand"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  maxLength={200}
                />
              </div>

              {/* City */}
              <div className="col-12 col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="input-brand"
                  value={formData.city}
                  onChange={handleChange}
                  maxLength={80}
                />
              </div>

              {/* State */}
              <div className="col-12 col-md-6">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className="input-brand"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={80}
                />
              </div>

              {/* Country */}
              <div className="col-12 col-md-6">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  className="input-brand"
                  value={formData.country}
                  onChange={handleChange}
                  maxLength={80}
                />
              </div>

              {/* Postal Code */}
              <div className="col-12 col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className="input-brand"
                  value={formData.postalCode}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>

              {/* Buttons */}
              <div className="col-12">
                <div className="d-flex justify-content-end gap-2 pt-3">
                  <button type="button" className="btn-ghost" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-amber" disabled={loading}>
                    <Save size={16} />
                    {loading ? "Saving..." : isEditMode ? "Update Customer" : "Create Customer"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
