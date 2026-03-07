"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Edit2, Trash2, Power, CheckCircle, XCircle, Plus, X } from "lucide-react";
import { paymentMethodApi, type PaymentMethodResponse, type PaymentMethodRequest, type PaymentMethodType } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PAYMENT_METHOD_TYPES: PaymentMethodType[] = ["Card", "Bank_Transfer", "Mobile_Wallet", "Cash", "Online_Banking"];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<PaymentMethodRequest>({
    methodName: "",
    type: "Card",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodApi.getAll();
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      methodName: "",
      type: "Card",
      description: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(method: PaymentMethodResponse) {
    setFormData({
      methodName: method.methodName,
      type: method.type,
      description: method.description || "",
      isActive: method.isActive,
    });
    setEditingId(method.paymentMethodId);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await paymentMethodApi.update(editingId, formData);
      } else {
        await paymentMethodApi.create(formData);
      }
      await loadMethods();
      resetForm();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to save payment method";
      setError(errorMessage);
    }
  }

  async function handleToggleStatus(id: number) {
    try {
      await paymentMethodApi.toggleStatus(id);
      await loadMethods();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await paymentMethodApi.delete(id);
      await loadMethods();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment method");
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading payment methods..." />;
  }

  return (
    <div>
      {}
      <div className="mb-4">
        <Link
          href="/dashboard/payments"
          className="d-inline-flex align-items-center gap-2 text-decoration-none text-steel-dark mb-3"
          style={{ fontSize: ".875rem" }}
        >
          <ChevronLeft size={16} />
          Back to Payments
        </Link>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-3">
          <div>
            <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
              Payment Methods
            </h1>
            <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
              {methods.length} payment method{methods.length === 1 ? "" : "s"} configured
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-amber d-flex align-items-center gap-2"
          >
            {showForm ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Payment Method
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            {error}
          </p>
        </div>
      )}

      {}
      {showForm && (
        <div className="card-brand p-4 mb-4">
          <h2 className="fw-semibold text-navy mb-3" style={{ fontSize: "1.125rem" }}>
            {editingId ? "Edit Payment Method" : "Add New Payment Method"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="methodName" className="form-label-brand">
                  Method Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="methodName"
                  value={formData.methodName}
                  onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                  required
                  className="input-brand"
                  placeholder="e.g., Visa Card, PayPal, Cash"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="type" className="form-label-brand">
                  Type <span className="text-danger">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethodType })}
                  required
                  className="input-brand"
                >
                  {PAYMENT_METHOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label-brand">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-brand"
                  placeholder="Enter description..."
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="form-check-input"
                  />
                  <label htmlFor="isActive" className="form-check-label text-navy" style={{ fontSize: ".875rem" }}>
                    Active (Available for processing payments)
                  </label>
                </div>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn-amber d-flex align-items-center gap-2">
                  <CreditCard size={16} />
                  {editingId ? "Update Method" : "Create Method"}
                </button>
                <button type="button" onClick={resetForm} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {}
      <div className="card-brand">
        {methods.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <CreditCard size={48} className="text-cream-dark" />
            <p className="mb-1 text-muted-brand" style={{ fontSize: ".875rem" }}>
              No payment methods found
            </p>
            <p className="mb-3 text-muted-brand" style={{ fontSize: ".75rem" }}>
              Create your first payment method to start processing payments
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-amber d-flex align-items-center gap-2"
              style={{ fontSize: ".875rem" }}
            >
              <Plus size={14} />
              Add Payment Method
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Method Name</th>
                  <th className="d-none d-md-table-cell">Type</th>
                  <th className="d-none d-lg-table-cell">Description</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method) => (
                  <tr key={method.paymentMethodId}>
                    <td>
                      <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                        #{method.paymentMethodId}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <CreditCard size={16} className="text-steel" />
                        <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                          {method.methodName}
                        </span>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className="status-badge sm"
                        style={{ background: "var(--navy-subtle)", color: "var(--navy)" }}
                      >
                        {method.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>
                        {method.description || "—"}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge sm d-inline-flex align-items-center gap-1"
                        style={method.isActive ? { background: "#d1fae5", color: "#065f46" } : { background: "var(--cream)", color: "var(--steel)" }}
                      >
                        {method.isActive ? (
                          <>
                            <CheckCircle size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          onClick={() => handleEdit(method)}
                          className="btn-icon"
                          title="Edit method"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(method.paymentMethodId)}
                          className="btn-icon"
                          title={method.isActive ? "Deactivate" : "Activate"}
                          style={{ color: method.isActive ? "#f59e0b" : "#16a34a" }}
                        >
                          <Power size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(method.paymentMethodId)}
                          className="btn-icon"
                          title="Delete method"
                          style={{ color: "var(--steel)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                            (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--steel)";
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      <div className="row g-3 mt-4">
        <div className="col-md-4">
          <div className="card-brand p-3">
            <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Total Methods
            </p>
            <p className="fw-bold text-navy mb-0" style={{ fontSize: "1.5rem" }}>
              {methods.length}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-brand p-3" style={{ background: "#d1fae5" }}>
            <p className="mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", color: "#065f46" }}>
              Active
            </p>
            <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "#065f46" }}>
              {methods.filter((m) => m.isActive).length}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-brand p-3" style={{ background: "var(--cream)" }}>
            <p className="mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--steel)" }}>
              Inactive
            </p>
            <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "var(--steel-dark)" }}>
              {methods.filter((m) => !m.isActive).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
