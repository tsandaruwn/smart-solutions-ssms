"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Warehouse as WarehouseIcon,
  ArrowLeft,
} from "lucide-react";
import {
  warehouseApi,
  type WarehouseResponse,
  type WarehouseRequest,
} from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<WarehouseRequest>({
    name: "",
    address: "",
    city: "",
    country: "",
    contactPhone: "",
    capacity: undefined,
    isActive: true,
  });

  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await warehouseApi.getAll();
      setWarehouses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load warehouses"
      );
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    if (!searchQuery.trim()) return warehouses;
    const q = searchQuery.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.city?.toLowerCase().includes(q) ||
        w.country?.toLowerCase().includes(q) ||
        String(w.warehouseId).includes(q)
    );
  }, [warehouses, searchQuery]);

  const totalPages = Math.ceil(filteredWarehouses.length / ITEMS_PER_PAGE);
  const paginatedWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await warehouseApi.delete(id);
      setWarehouses((prev) => prev.filter((w) => w.warehouseId !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await warehouseApi.create(form);
      setWarehouses((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({
        name: "",
        address: "",
        city: "",
        country: "",
        contactPhone: "",
        capacity: undefined,
        isActive: true,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading warehouses..." />;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard/inventory"
        className="d-inline-flex align-items-center gap-2 text-decoration-none text-muted-brand mb-3"
        style={{ fontSize: ".875rem" }}
      >
        <ArrowLeft size={16} />
        Back to Inventory
      </Link>

      {/* Backend warning */}
      {error && (
        <div className="warning-banner mb-4">
          <span
            className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0"
            style={{ width: 8, height: 8 }}
          />
          <p
            className="mb-0 text-amber-dark"
            style={{ fontSize: ".875rem" }}
          >
            <strong>Backend not connected</strong> &mdash; Start the Inventory
            Management service on port 8084 to see live data.
          </p>
          <button
            onClick={fetchWarehouses}
            className="btn-ghost ms-auto"
            style={{ padding: "4px 12px", fontSize: ".75rem" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1
            className="fw-bold text-navy mb-1"
            style={{ fontSize: "1.5rem" }}
          >
            Warehouse Management
          </h1>
          <p
            className="text-muted-brand mb-0"
            style={{ fontSize: ".875rem" }}
          >
            {filteredWarehouses.length} warehouse
            {filteredWarehouses.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-amber"
        >
          <Plus size={16} />
          Add Warehouse
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card-brand mb-4">
          <div className="p-4">
            <h2
              className="fw-bold text-navy mb-3"
              style={{ fontSize: "1.1rem" }}
            >
              New Warehouse
            </h2>
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Warehouse name"
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    maxLength={20}
                    value={form.contactPhone || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contactPhone: e.target.value,
                      }))
                    }
                    placeholder="Phone number"
                  />
                </div>
                <div className="col-12">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    value={form.address || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    placeholder="Full address"
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    maxLength={80}
                    value={form.city || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    maxLength={80}
                    value={form.country || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand fw-medium"
                    style={{ fontSize: ".875rem" }}
                  >
                    Capacity
                  </label>
                  <input
                    type="number"
                    className="input-brand"
                    min={0}
                    value={form.capacity ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        capacity: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-amber"
                >
                  {submitting ? "Creating..." : "Create Warehouse"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by name, city, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card-brand">
        {paginatedWarehouses.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <WarehouseIcon size={48} className="text-cream-dark" />
            <p
              className="mb-1 text-muted-brand"
              style={{ fontSize: ".875rem" }}
            >
              No warehouses match your criteria
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn-ghost"
              style={{
                padding: "4px 12px",
                fontSize: ".875rem",
                color: "var(--amber-dark)",
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">City</th>
                  <th className="d-none d-lg-table-cell">Country</th>
                  <th className="d-none d-md-table-cell">Phone</th>
                  <th className="d-none d-lg-table-cell text-end">
                    Capacity
                  </th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWarehouses.map((w) => (
                  <tr key={w.warehouseId}>
                    <td>
                      <span
                        className="fw-semibold text-navy"
                        style={{ fontSize: ".875rem" }}
                      >
                        #{w.warehouseId}
                      </span>
                    </td>
                    <td>
                      <span
                        className="fw-medium text-navy"
                        style={{ fontSize: ".875rem" }}
                      >
                        {w.name}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {w.city || "—"}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {w.country || "—"}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {w.contactPhone || "—"}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell text-end">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {w.capacity ? w.capacity.toLocaleString() : "—"}
                      </span>
                    </td>
                    <td>
                      {w.isActive ? (
                        <span
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium"
                          style={{
                            fontSize: ".75rem",
                            background: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium"
                          style={{
                            fontSize: ".75rem",
                            background: "#fee2e2",
                            color: "#dc2626",
                          }}
                        >
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        {deleteConfirm === w.warehouseId ? (
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() =>
                                handleDelete(w.warehouseId)
                              }
                              className="btn btn-danger btn-sm py-0 px-2"
                              style={{ fontSize: ".75rem" }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="btn btn-secondary btn-sm py-0 px-2"
                              style={{ fontSize: ".75rem" }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setDeleteConfirm(w.warehouseId)
                            }
                            className="btn-icon"
                            title="Deactivate warehouse"
                            style={{ color: "var(--steel)" }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#ef4444";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "var(--steel)";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "transparent";
                            }}
                          >
                            <Trash2 size={15} />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="d-flex align-items-center justify-content-between px-4 py-3"
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "rgba(242,238,234,.3)",
            }}
          >
            <p
              className="mb-0 text-muted-brand"
              style={{ fontSize: ".875rem" }}
            >
              Showing{" "}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredWarehouses.length
              )}{" "}
              of {filteredWarehouses.length}
            </p>
            <div className="d-flex align-items-center gap-1">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="page-btn"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
