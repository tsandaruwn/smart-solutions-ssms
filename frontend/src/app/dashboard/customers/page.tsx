"use client";

import { useEffect, useState } from "react";
import {
  customerApi,
  type CustomerResponse,
  type CustomerRequest,
  type CustomerUpdateRequest,
} from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Users,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatCard from "@/components/ui/StatCard";

const ITEMS_PER_PAGE = 10;

const emptyForm: CustomerRequest = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  dateOfBirth: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerRequest>(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadCustomers = async (page = 0, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerApi.getAll(page, ITEMS_PER_PAGE, search);
      setCustomers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(0, searchTerm || undefined);
  }, []);

  const handleSearch = () => {
    loadCustomers(0, searchTerm || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (c: CustomerResponse) => {
    setEditingId(c.customerId);
    setForm({
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone || "",
      addressLine1: c.addressLine1 || "",
      addressLine2: c.addressLine2 || "",
      city: c.city || "",
      state: c.state || "",
      country: c.country || "",
      postalCode: c.postalCode || "",
      dateOfBirth: c.dateOfBirth || "",
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        const updateData: CustomerUpdateRequest = {};
        Object.entries(form).forEach(([key, value]) => {
          if (value) (updateData as Record<string, string>)[key] = value;
        });
        await customerApi.update(editingId, updateData);
        setSuccess("Customer updated successfully");
      } else {
        await customerApi.create(form);
        setSuccess("Customer created successfully");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadCustomers(currentPage, searchTerm || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await customerApi.delete(id);
      setSuccess("Customer deleted successfully");
      setDeleteConfirm(null);
      await loadCustomers(currentPage, searchTerm || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete customer");
    }
  };

  const handlePageChange = (page: number) => {
    loadCustomers(page, searchTerm || undefined);
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  return (
    <div>
      {}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">Customers</h2>
          <p className="text-steel mb-0">Manage your customer database</p>
        </div>
        <button className="btn btn-amber d-flex align-items-center gap-2" onClick={openCreateForm}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard title="Total Customers" value={totalElements} icon={Users} color="navy" />
        </div>
      </div>

      {}
      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
          {success}
        </div>
      )}
      {error && <ErrorMessage message={error} onRetry={() => loadCustomers(currentPage)} />}

      {}
      <div className="card card-brand mb-4">
        <div className="card-body py-3">
          <div className="d-flex gap-2">
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
                placeholder="Search by name, email, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="btn btn-navy" onClick={handleSearch}>
              Search
            </button>
            {searchTerm && (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSearchTerm("");
                  loadCustomers(0);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card card-brand">
          <div className="table-responsive">
            <table className="table table-brand mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Registered</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-steel">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.customerId}>
                      <td className="fw-medium">#{c.customerId}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-navy d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{ width: 32, height: 32, color: "var(--amber)" }}
                          >
                            {c.firstName[0]}
                            {c.lastName[0]}
                          </div>
                          <span className="fw-medium">
                            {c.firstName} {c.lastName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Mail size={14} className="text-steel" />
                          {c.email}
                        </div>
                      </td>
                      <td>
                        {c.phone ? (
                          <div className="d-flex align-items-center gap-1">
                            <Phone size={14} className="text-steel" />
                            {c.phone}
                          </div>
                        ) : (
                          <span className="text-steel">—</span>
                        )}
                      </td>
                      <td>
                        {c.city ? (
                          <div className="d-flex align-items-center gap-1">
                            <MapPin size={14} className="text-steel" />
                            {c.city}
                          </div>
                        ) : (
                          <span className="text-steel">—</span>
                        )}
                      </td>
                      <td>
                        {c.registrationDate
                          ? new Date(c.registrationDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-icon"
                            title="Edit"
                            onClick={() => openEditForm(c)}
                          >
                            <Edit size={15} />
                          </button>
                          {deleteConfirm === c.customerId ? (
                            <>
                              <button
                                className="btn btn-sm"
                                style={{ color: "var(--red, #dc3545)", fontSize: ".75rem" }}
                                onClick={() => handleDelete(c.customerId)}
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
                            <button
                              className="btn btn-icon"
                              title="Delete"
                              onClick={() => setDeleteConfirm(c.customerId)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {}
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <span className="text-steel" style={{ fontSize: ".875rem" }}>
                Showing {currentPage * ITEMS_PER_PAGE + 1}–
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalElements)} of{" "}
                {totalElements}
              </span>
              <div className="d-flex gap-1">
                <button
                  className="page-btn"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i ? "active" : ""}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {showForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div
              className="card card-brand"
              style={{ width: 600, maxHeight: "90vh", overflow: "auto" }}
            >
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">
                  {editingId ? "Edit Customer" : "New Customer"}
                </h5>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">First Name *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Last Name *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
                    <div className="col-12">
                      <label className="form-label fw-medium">Address Line 1</label>
                      <input
                        className="input-brand w-100"
                        value={form.addressLine1}
                        onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Address Line 2</label>
                      <input
                        className="input-brand w-100"
                        value={form.addressLine2}
                        onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">City</label>
                      <input
                        className="input-brand w-100"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">State</label>
                      <input
                        className="input-brand w-100"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Country</label>
                      <input
                        className="input-brand w-100"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Postal Code</label>
                      <input
                        className="input-brand w-100"
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date of Birth</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    {editingId ? "Update" : "Create"} Customer
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
