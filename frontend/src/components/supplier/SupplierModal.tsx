// ====================================
// SUPPLIER MODAL COMPONENT
// Purpose: Modal form for creating and editing suppliers
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// Features: Form validation, Create/Edit modes, Date pickers
// ====================================

"use client";

import { useState, useEffect } from "react";
import { X, Save, Building2, Mail, User, Phone, MapPin, Calendar } from "lucide-react";
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "@/types/supplier";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: CreateSupplierRequest | UpdateSupplierRequest) => Promise<void>;
  supplier?: Supplier | null; // If provided, modal is in edit mode
  title?: string;
}

export default function SupplierModal({
  isOpen,
  onClose,
  onSave,
  supplier,
  title,
}: SupplierModalProps) {
  const isEditMode = !!supplier;
  const modalTitle = title || (isEditMode ? "Edit Supplier" : "Create New Supplier");

  // Form state
  const [formData, setFormData] = useState<CreateSupplierRequest>({
    email: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    contractStartDate: "",
    contractEndDate: "",
    isActive: true,
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Initialize form data when modal opens or supplier changes
   */
  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        // Edit mode - populate form with supplier data
        setFormData({
          email: supplier.email || "",
          companyName: supplier.companyName || "",
          contactPerson: supplier.contactPerson || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          city: supplier.city || "",
          country: supplier.country || "",
          contractStartDate: supplier.contractStartDate || "",
          contractEndDate: supplier.contractEndDate || "",
          isActive: supplier.isActive,
        });
      } else {
        // Create mode - reset form
        resetForm();
      }
      setErrors({});
    }
  }, [isOpen, supplier]);

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      email: "",
      companyName: "",
      contactPerson: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      contractStartDate: "",
      contractEndDate: "",
      isActive: true,
    });
    setErrors({});
  };

  /**
   * Handle input field changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Validate form data
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 150) {
      newErrors.email = "Email must be less than 150 characters";
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.length > 150) {
      newErrors.companyName = "Company name must be less than 150 characters";
    }

    // Contact person validation
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    } else if (formData.contactPerson.length > 100) {
      newErrors.contactPerson = "Contact person must be less than 100 characters";
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Phone must be less than 20 characters";
    }

    // City validation
    if (formData.city && formData.city.length > 80) {
      newErrors.city = "City must be less than 80 characters";
    }

    // Country validation
    if (formData.country && formData.country.length > 80) {
      newErrors.country = "Country must be less than 80 characters";
    }

    // Contract date validation
    if (formData.contractStartDate && formData.contractEndDate) {
      const start = new Date(formData.contractStartDate);
      const end = new Date(formData.contractEndDate);
      if (end < start) {
        newErrors.contractEndDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      resetForm();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to save supplier" });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={handleClose} />

      {/* Modal */}
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Building2 size={24} style={{ color: "var(--amber)" }} />
            <h2 style={styles.title}>{modalTitle}</h2>
          </div>
          <button onClick={handleClose} style={styles.closeButton} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.scrollArea}>
            {/* General submit error */}
            {errors.submit && (
              <div style={styles.errorBanner}>
                <strong>Error:</strong> {errors.submit}
              </div>
            )}

            {/* Company Information Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Company Information</h3>

              <div style={styles.formRow}>
                {/* Company Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Building2 size={16} />
                    Company Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.companyName && styles.inputError),
                    }}
                    placeholder="Enter company name"
                    maxLength={150}
                    disabled={isSubmitting}
                  />
                  {errors.companyName && (
                    <span style={styles.error}>{errors.companyName}</span>
                  )}
                </div>

                {/* Email */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Mail size={16} />
                    Email <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.email && styles.inputError),
                    }}
                    placeholder="email@company.com"
                    maxLength={150}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span style={styles.error}>{errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Contact Information</h3>

              <div style={styles.formRow}>
                {/* Contact Person */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <User size={16} />
                    Contact Person <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.contactPerson && styles.inputError),
                    }}
                    placeholder="John Doe"
                    maxLength={100}
                    disabled={isSubmitting}
                  />
                  {errors.contactPerson && (
                    <span style={styles.error}>{errors.contactPerson}</span>
                  )}
                </div>

                {/* Phone */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Phone size={16} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.phone && styles.inputError),
                    }}
                    placeholder="+1 234 567 8900"
                    maxLength={20}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span style={styles.error}>{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Location Information</h3>

              {/* Address */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <MapPin size={16} />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    ...styles.textarea,
                    ...(errors.address && styles.inputError),
                  }}
                  placeholder="123 Main Street, Suite 100"
                  rows={2}
                  disabled={isSubmitting}
                />
                {errors.address && <span style={styles.error}>{errors.address}</span>}
              </div>

              <div style={styles.formRow}>
                {/* City */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.city && styles.inputError),
                    }}
                    placeholder="New York"
                    maxLength={80}
                    disabled={isSubmitting}
                  />
                  {errors.city && <span style={styles.error}>{errors.city}</span>}
                </div>

                {/* Country */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.country && styles.inputError),
                    }}
                    placeholder="USA"
                    maxLength={80}
                    disabled={isSubmitting}
                  />
                  {errors.country && <span style={styles.error}>{errors.country}</span>}
                </div>
              </div>
            </div>

            {/* Contract Information Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Contract Information</h3>

              <div style={styles.formRow}>
                {/* Contract Start Date */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Contract Start Date
                  </label>
                  <input
                    type="date"
                    name="contractStartDate"
                    value={formData.contractStartDate}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.contractStartDate && styles.inputError),
                    }}
                    disabled={isSubmitting}
                  />
                  {errors.contractStartDate && (
                    <span style={styles.error}>{errors.contractStartDate}</span>
                  )}
                </div>

                {/* Contract End Date */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Contract End Date
                  </label>
                  <input
                    type="date"
                    name="contractEndDate"
                    value={formData.contractEndDate}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.contractEndDate && styles.inputError),
                    }}
                    disabled={isSubmitting}
                  />
                  {errors.contractEndDate && (
                    <span style={styles.error}>{errors.contractEndDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Status</h3>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={styles.checkbox}
                  disabled={isSubmitting}
                />
                <label htmlFor="isActive" style={styles.checkboxLabel}>
                  Active supplier (can receive orders and manage products)
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button
              type="button"
              onClick={handleClose}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveButton} disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? "Saving..." : isEditMode ? "Update Supplier" : "Create Supplier"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ====================================
// STYLES
// Uses brand color palette
// ====================================
const styles = {
  // Overlay
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 50, 99, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  } as React.CSSProperties,

  // Modal
  modal: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    backgroundColor: "var(--surface)",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(26, 50, 99, 0.3)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  } as React.CSSProperties,

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px",
    borderBottom: "1px solid var(--border-color)",
    backgroundColor: "var(--cream-light)",
  } as React.CSSProperties,

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--navy)",
  } as React.CSSProperties,

  closeButton: {
    background: "none",
    border: "none",
    color: "var(--steel)",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  // Form
  form: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
    minHeight: 0,
  } as React.CSSProperties,

  scrollArea: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "24px",
  } as React.CSSProperties,

  section: {
    marginBottom: "24px",
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--navy)",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid var(--amber)",
  } as React.CSSProperties,

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  } as React.CSSProperties,

  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  } as React.CSSProperties,

  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--navy)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  } as React.CSSProperties,

  required: {
    color: "#ef4444",
  } as React.CSSProperties,

  input: {
    padding: "10px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--navy)",
    backgroundColor: "var(--surface)",
    transition: "all 0.2s",
  } as React.CSSProperties,

  textarea: {
    padding: "10px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--navy)",
    backgroundColor: "var(--surface)",
    transition: "all 0.2s",
    fontFamily: "inherit",
    resize: "vertical" as const,
  } as React.CSSProperties,

  inputError: {
    borderColor: "#ef4444",
  } as React.CSSProperties,

  error: {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "2px",
  } as React.CSSProperties,

  errorBanner: {
    padding: "12px 16px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#dc2626",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  } as React.CSSProperties,

  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  } as React.CSSProperties,

  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "var(--amber)",
  } as React.CSSProperties,

  checkboxLabel: {
    fontSize: "14px",
    color: "var(--navy)",
    cursor: "pointer",
  } as React.CSSProperties,

  // Footer
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "24px",
    borderTop: "1px solid var(--border-color)",
    backgroundColor: "var(--cream-light)",
  } as React.CSSProperties,

  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "var(--cream)",
    color: "var(--navy)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,

  saveButton: {
    padding: "12px 24px",
    backgroundColor: "var(--amber)",
    color: "var(--navy)",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  } as React.CSSProperties,
};
