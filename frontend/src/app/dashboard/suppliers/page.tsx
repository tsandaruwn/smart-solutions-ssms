"use client";

import { useEffect, useMemo, useState } from "react";
import {
  supplierApi,
  supplierProductApi,
  type SupplierResponse,
  type SupplierRequest,
  type SupplierProductResponse,
  type SupplierProductRequest,
} from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatCard from "@/components/ui/StatCard";

const emptySupplierForm: SupplierRequest = {
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
};

const emptyProductForm: SupplierProductRequest = {
  productName: "",
  description: "",
  unitPrice: 0,
  quantityInStock: 0,
  supplierId: 0,
  isActive: true,
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Supplier form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SupplierRequest>(emptySupplierForm);

  // Product form state
  const [expandedSupplier, setExpandedSupplier] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<SupplierProductRequest>(emptyProductForm);

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<number | null>(null);

  const loadSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: SupplierResponse[];
      if (searchTerm) {
        data = await supplierApi.search(searchTerm);
      } else if (showOnlyActive) {
        data = await supplierApi.getActive();
      } else {
        data = await supplierApi.getAll();
      }
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [showOnlyActive]);

  const handleSearch = () => loadSuppliers();

  const stats = useMemo(() => {
    const active = suppliers.filter((s) => s.isActive).length;
    return { total: suppliers.length, active, inactive: suppliers.length - active };
  }, [suppliers]);

  // Supplier CRUD
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptySupplierForm);
    setShowForm(true);
  };

  const openEditForm = (s: SupplierResponse) => {
    setEditingId(s.supplierId);
    setForm({
      email: s.email,
      companyName: s.companyName,
      contactPerson: s.contactPerson,
      phone: s.phone || "",
      address: s.address || "",
      city: s.city || "",
      country: s.country || "",
      contractStartDate: s.contractStartDate || "",
      contractEndDate: s.contractEndDate || "",
      isActive: s.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        await supplierApi.update(editingId, form);
        setSuccess("Supplier updated");
      } else {
        await supplierApi.create(form);
        setSuccess("Supplier created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptySupplierForm);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save supplier");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await supplierApi.delete(id);
      setSuccess("Supplier deleted");
      setDeleteConfirm(null);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete supplier");
    }
  };

  const toggleActive = async (s: SupplierResponse) => {
    try {
      if (s.isActive) {
        await supplierApi.deactivate(s.supplierId);
        setSuccess(`${s.companyName} deactivated`);
      } else {
        await supplierApi.activate(s.supplierId);
        setSuccess(`${s.companyName} activated`);
      }
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  // Product CRUD
  const openProductForm = (supplierId: number) => {
    setEditingProductId(null);
    setProductForm({ ...emptyProductForm, supplierId });
    setShowProductForm(true);
  };

  const openEditProductForm = (p: SupplierProductResponse) => {
    setEditingProductId(p.productId);
    setProductForm({
      productName: p.productName,
      description: p.description || "",
      unitPrice: p.unitPrice,
      quantityInStock: p.quantityInStock,
      supplierId: p.supplierId,
      isActive: p.isActive,
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingProductId) {
        await supplierProductApi.update(editingProductId, productForm);
        setSuccess("Product updated");
      } else {
        await supplierProductApi.create(productForm);
        setSuccess("Product created");
      }
      setShowProductForm(false);
      setEditingProductId(null);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await supplierProductApi.delete(id);
      setSuccess("Product deleted");
      setDeleteProductConfirm(null);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">Suppliers</h2>
          <p className="text-steel mb-0">Manage suppliers and their product catalogs</p>
        </div>
        <button className="btn btn-amber d-flex align-items-center gap-2" onClick={openCreateForm}>
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard title="Total Suppliers" value={stats.total} icon={Truck} color="navy" />
        </div>
        <div className="col-md-4">
          <StatCard title="Active" value={stats.active} icon={CheckCircle} color="green" />
        </div>
        <div className="col-md-4">
          <StatCard title="Inactive" value={stats.inactive} icon={XCircle} color="red" />
        </div>
      </div>

      {/* Messages */}
      {success && <div className="alert alert-success mb-3">{success}</div>}
      {error && <ErrorMessage message={error} onRetry={loadSuppliers} />}

      {/* Search & Filters */}
      <div className="card card-brand mb-4">
        <div className="card-body py-3">
          <div className="d-flex gap-2 align-items-center">
            <div className="position-relative flex-grow-1">
              <Search
                size={16}
                className="position-absolute"
                style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--steel)" }}
              />
              <input
                type="text"
                className="input-brand w-100"
                style={{ paddingLeft: 36 }}
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="btn btn-navy" onClick={handleSearch}>
              Search
            </button>
            <div className="d-flex gap-2">
              <button
                className={`filter-pill ${!showOnlyActive ? "active" : ""}`}
                onClick={() => { setShowOnlyActive(false); setSearchTerm(""); }}
              >
                All
              </button>
              <button
                className={`filter-pill ${showOnlyActive ? "active" : ""}`}
                onClick={() => { setShowOnlyActive(true); setSearchTerm(""); }}
              >
                Active Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="d-flex flex-column gap-3">
          {suppliers.length === 0 ? (
            <div className="card card-brand">
              <div className="card-body text-center py-5 text-steel">No suppliers found</div>
            </div>
          ) : (
            suppliers.map((s) => (
              <div key={s.supplierId} className="card card-brand">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-3 align-items-start">
                      <div
                        className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 ${s.isActive ? "bg-navy" : ""}`}
                        style={{
                          width: 44,
                          height: 44,
                          background: s.isActive ? undefined : "var(--steel-light)",
                          color: s.isActive ? "var(--amber)" : "var(--steel)",
                        }}
                      >
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="mb-0 fw-bold text-navy">{s.companyName}</h6>
                          <span
                            className={`status-badge ${s.isActive ? "status-delivered" : "status-cancelled"}`}
                          >
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="d-flex gap-3 text-steel" style={{ fontSize: ".85rem" }}>
                          <span>{s.contactPerson}</span>
                          <span>•</span>
                          <span>{s.email}</span>
                          {s.phone && (
                            <>
                              <span>•</span>
                              <span>{s.phone}</span>
                            </>
                          )}
                        </div>
                        {(s.city || s.country) && (
                          <div className="text-steel mt-1" style={{ fontSize: ".8rem" }}>
                            📍 {[s.city, s.country].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => toggleActive(s)}
                        title={s.isActive ? "Deactivate" : "Activate"}
                      >
                        {s.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button className="btn btn-icon" onClick={() => openEditForm(s)}>
                        <Edit size={15} />
                      </button>
                      {deleteConfirm === s.supplierId ? (
                        <>
                          <button
                            className="btn btn-sm"
                            style={{ color: "#dc3545", fontSize: ".75rem" }}
                            onClick={() => handleDelete(s.supplierId)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-sm text-steel"
                            style={{ fontSize: ".75rem" }}
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-icon" onClick={() => setDeleteConfirm(s.supplierId)}>
                          <Trash2 size={15} />
                        </button>
                      )}
                      <button
                        className="btn btn-icon ms-1"
                        onClick={() =>
                          setExpandedSupplier(expandedSupplier === s.supplierId ? null : s.supplierId)
                        }
                      >
                        {expandedSupplier === s.supplierId ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Products */}
                  {expandedSupplier === s.supplierId && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold text-navy d-flex align-items-center gap-2">
                          <Package size={16} />
                          Products ({s.products?.length || 0})
                        </h6>
                        <button
                          className="btn btn-sm btn-navy d-flex align-items-center gap-1"
                          onClick={() => openProductForm(s.supplierId)}
                        >
                          <Plus size={14} /> Add Product
                        </button>
                      </div>
                      {!s.products || s.products.length === 0 ? (
                        <p className="text-steel mb-0" style={{ fontSize: ".85rem" }}>
                          No products yet
                        </p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-brand table-sm mb-0">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Unit Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th style={{ width: 100 }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {s.products.map((p) => (
                                <tr key={p.productId}>
                                  <td>
                                    <div className="fw-medium">{p.productName}</div>
                                    {p.description && (
                                      <div className="text-steel" style={{ fontSize: ".8rem" }}>
                                        {p.description}
                                      </div>
                                    )}
                                  </td>
                                  <td>${p.unitPrice.toFixed(2)}</td>
                                  <td>{p.quantityInStock}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${p.isActive ? "status-delivered" : "status-cancelled"}`}
                                    >
                                      {p.isActive ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-icon"
                                        onClick={() => openEditProductForm(p)}
                                      >
                                        <Edit size={14} />
                                      </button>
                                      {deleteProductConfirm === p.productId ? (
                                        <button
                                          className="btn btn-sm"
                                          style={{ color: "#dc3545", fontSize: ".7rem" }}
                                          onClick={() => handleDeleteProduct(p.productId)}
                                        >
                                          Yes
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-icon"
                                          onClick={() => setDeleteProductConfirm(p.productId)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Supplier Modal */}
      {showForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 600, maxHeight: "90vh", overflow: "auto" }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">
                  {editingId ? "Edit Supplier" : "New Supplier"}
                </h5>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Company Name *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Contact Person *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Email *</label>
                      <input
                        type="email"
                        className="input-brand w-100"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Phone</label>
                      <input
                        className="input-brand w-100"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">City</label>
                      <input
                        className="input-brand w-100"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Country</label>
                      <input
                        className="input-brand w-100"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Address</label>
                      <textarea
                        className="textarea-brand w-100"
                        rows={2}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Contract Start</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        value={form.contractStartDate}
                        onChange={(e) => setForm({ ...form, contractStartDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Contract End</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        value={form.contractEndDate}
                        onChange={(e) => setForm({ ...form, contractEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    {editingId ? "Update" : "Create"} Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      {showProductForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowProductForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 500, maxHeight: "90vh", overflow: "auto" }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">
                  {editingProductId ? "Edit Product" : "New Product"}
                </h5>
                <button className="btn btn-icon" onClick={() => setShowProductForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Product Name *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={productForm.productName}
                        onChange={(e) =>
                          setProductForm({ ...productForm, productName: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Description</label>
                      <textarea
                        className="textarea-brand w-100"
                        rows={2}
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Unit Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-brand w-100"
                        required
                        value={productForm.unitPrice || ""}
                        onChange={(e) =>
                          setProductForm({ ...productForm, unitPrice: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Qty in Stock *</label>
                      <input
                        type="number"
                        min="0"
                        className="input-brand w-100"
                        required
                        value={productForm.quantityInStock || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            quantityInStock: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    {editingProductId ? "Update" : "Create"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
