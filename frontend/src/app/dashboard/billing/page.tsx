"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileText,
  Pencil,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  billingApi,
  orderApi,
  type Bill,
  type BillDto,
  type OrderResponse,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 8;
const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "PARTIALLY_PAID"] as const;
const INVOICE_STATUS_OPTIONS = ["PENDING", "PAID", "PARTIALLY_PAID"];

export default function BillingPage() {
  // ── Orders ──────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");

  // per-order generate state: orderId → { loading, result, error }
  const [genState, setGenState] = useState<
    Record<
      number,
      { loading: boolean; result: BillDto | null; error: string | null }
    >
  >({});

  // ── Invoices ─────────────────────────────────────────────────────────────
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [customerIdFilter, setCustomerIdFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editSaving, setEditSaving] = useState(false);

  // ── Load orders + all invoices on mount ───────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await orderApi.getAll();
        setOrders(data);
      } catch (err) {
        setOrdersError(
          err instanceof Error ? err.message : "Failed to load orders",
        );
      } finally {
        setOrdersLoading(false);
      }
    })();
    fetchAllBills();
  }, []);

  const fetchAllBills = async () => {
    setBillsLoading(true);
    setBillsError(null);
    try {
      const data = await billingApi.getAll();
      setBills(data);
    } catch (err) {
      setBillsError(
        err instanceof Error ? err.message : "Failed to load invoices",
      );
    } finally {
      setBillsLoading(false);
    }
  };

  // ── Generate invoice for an order ────────────────────────────────────────
  const handleGenerate = async (
    orderId: number,
    _customerIdForOrder: number,
  ) => {
    setGenState((prev) => ({
      ...prev,
      [orderId]: { loading: true, result: null, error: null },
    }));
    try {
      const result = await billingApi.generateInvoice(orderId);
      setGenState((prev) => ({
        ...prev,
        [orderId]: { loading: false, result, error: null },
      }));
      // auto-refresh invoice list so the new invoice appears immediately
      fetchAllBills();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      setGenState((prev) => ({
        ...prev,
        [orderId]: { loading: false, result: null, error: msg },
      }));
    }
  };

  // ── Delete invoice ────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await billingApi.delete(id);
      setBills((prev) => prev.filter((b) => b.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // ── Inline edit save ──────────────────────────────────────────────────────
  const handleEditSave = async (id: number) => {
    setEditSaving(true);
    try {
      const updated = await billingApi.update(id, { status: editStatus });
      setBills((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Filtered / paginated invoices ─────────────────────────────────────────
  const filteredBills = useMemo(() => {
    let result = bills;
    // customer ID filter (in-memory)
    const cid = Number(customerIdFilter);
    if (cid > 0) result = result.filter((b) => b.customerId === cid);
    if (statusFilter !== "ALL")
      result = result.filter((b) => b.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          String(b.id).includes(q) ||
          String(b.orderId).includes(q) ||
          String(b.customerId).includes(q),
      );
    }
    return result;
  }, [bills, statusFilter, searchQuery, customerIdFilter]);

  const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE);
  const paginated = filteredBills.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, customerIdFilter]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const statusColor = (status: string) => {
    if (status === "PAID") return { background: "#d1fae5", color: "#065f46" };
    if (status === "PENDING")
      return { background: "#fef9c3", color: "#854d0e" };
    return { background: "#fee2e2", color: "#991b1b" };
  };

  const orderStatusColor = (status: string) => {
    if (status === "DELIVERED")
      return { background: "#d1fae5", color: "#065f46" };
    if (status === "SHIPPED")
      return { background: "#dbeafe", color: "#1e40af" };
    if (status === "PENDING")
      return { background: "#fef9c3", color: "#854d0e" };
    return { background: "#fee2e2", color: "#991b1b" };
  };

  const filteredOrders = useMemo(() => {
    if (!orderSearch.trim()) return orders;
    const q = orderSearch.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.orderId).includes(q) ||
        (o.orderNumber || "").toLowerCase().includes(q) ||
        String(o.customerId).includes(q),
    );
  }, [orders, orderSearch]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
          Billing &amp; Invoices
        </h1>
        <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
          Generate invoices from orders and manage existing invoices
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 – ORDERS                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-5">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-2 mb-3">
          <h2
            className="fw-semibold text-navy mb-0"
            style={{ fontSize: "1.1rem" }}
          >
            Orders
          </h2>
          <div className="search-wrapper" style={{ maxWidth: 280 }}>
            <Search className="search-icon" size={15} />
            <input
              type="text"
              placeholder="Search orders…"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="input-brand"
            />
          </div>
        </div>

        {ordersLoading && <LoadingSpinner message="Loading orders…" />}

        {ordersError && (
          <div className="warning-banner mb-3">
            <AlertCircle size={15} style={{ color: "var(--amber-dark)" }} />
            <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
              {ordersError}
            </p>
          </div>
        )}

        {!ordersLoading && !ordersError && (
          <div className="card-brand">
            {filteredOrders.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                <FileText size={40} className="text-cream-dark" />
                <p
                  className="mb-0 text-muted-brand"
                  style={{ fontSize: ".875rem" }}
                >
                  {orders.length === 0
                    ? "No orders found"
                    : "No orders match your search"}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table-brand">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th className="d-none d-md-table-cell">Customer</th>
                      <th className="d-none d-lg-table-cell">Date</th>
                      <th>Status</th>
                      <th className="text-end d-none d-sm-table-cell">Total</th>
                      <th className="text-end">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const gs = genState[order.orderId];
                      const alreadyExists = gs?.error
                        ?.toLowerCase()
                        .includes("already exists");
                      return (
                        <tr key={order.orderId}>
                          <td>
                            <span
                              className="fw-semibold text-navy"
                              style={{ fontSize: ".875rem" }}
                            >
                              {order.orderNumber || `#${order.orderId}`}
                            </span>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span
                              className="text-muted-brand"
                              style={{ fontSize: ".875rem" }}
                            >
                              Customer #{order.customerId}
                            </span>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <span
                              className="text-muted-brand"
                              style={{ fontSize: ".875rem" }}
                            >
                              {order.orderDate
                                ? new Date(order.orderDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </td>
                          <td>
                            <span
                              className="status-badge sm"
                              style={orderStatusColor(order.status)}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="text-end d-none d-sm-table-cell">
                            <span style={{ fontSize: ".875rem" }}>
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </td>
                          <td className="text-end">
                            {(() => {
                              if (gs?.result)
                                return (
                                  <span
                                    className="d-inline-flex align-items-center gap-1"
                                    style={{
                                      fontSize: ".8rem",
                                      color: "#16a34a",
                                    }}
                                  >
                                    <CheckCircle size={13} />
                                    INV-
                                    {String(gs.result.billId).padStart(5, "0")}
                                  </span>
                                );
                              if (alreadyExists)
                                return (
                                  <span
                                    style={{
                                      fontSize: ".75rem",
                                      color: "#6b7280",
                                    }}
                                    title="Invoice already generated for this order"
                                  >
                                    Already invoiced
                                  </span>
                                );
                              return (
                                <button
                                  onClick={() =>
                                    handleGenerate(
                                      order.orderId,
                                      order.customerId,
                                    )
                                  }
                                  disabled={gs?.loading}
                                  className="btn-amber"
                                  style={{
                                    fontSize: ".78rem",
                                    padding: "4px 12px",
                                  }}
                                >
                                  {gs?.loading ? "…" : "Generate Invoice"}
                                </button>
                              );
                            })()}
                            {gs?.error && !alreadyExists && (
                              <p
                                className="mb-0 mt-1"
                                style={{ fontSize: ".72rem", color: "#dc2626" }}
                              >
                                {gs.error}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 – INVOICES                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div>
        {/* Section header with inline filters */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-2 mb-3">
          <div>
            <h2
              className="fw-semibold text-navy mb-0"
              style={{ fontSize: "1.1rem" }}
            >
              Invoices
            </h2>
            <p className="text-muted-brand mb-0" style={{ fontSize: ".78rem" }}>
              {filteredBills.length} invoice
              {filteredBills.length === 1 ? "" : "s"}
              {Number(customerIdFilter) > 0
                ? ` for customer #${customerIdFilter}`
                : ""}
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <input
              type="number"
              placeholder="Filter by Customer ID"
              value={customerIdFilter}
              onChange={(e) => setCustomerIdFilter(e.target.value)}
              className="input-brand"
              style={{ maxWidth: 170 }}
            />
            <button
              onClick={fetchAllBills}
              disabled={billsLoading}
              className="btn-ghost"
              style={{ whiteSpace: "nowrap", fontSize: ".8rem" }}
              title="Refresh invoices"
            >
              {billsLoading ? "Loading…" : "↻ Refresh"}
            </button>
          </div>
        </div>

        {billsError && (
          <div className="warning-banner mb-3">
            <AlertCircle size={15} style={{ color: "var(--amber-dark)" }} />
            <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
              {billsError}
            </p>
          </div>
        )}

        {billsLoading ? (
          <LoadingSpinner message="Loading invoices…" />
        ) : (
          <>
            {/* Filters */}
            <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
              <div className="search-wrapper flex-grow-1">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search by invoice, order or customer ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-brand"
                />
              </div>
              <div className="filter-pill-group flex-shrink-0">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`filter-pill ${statusFilter === s ? "active" : ""}`}
                  >
                    {s === "ALL"
                      ? "All"
                      : s.charAt(0) +
                        s.slice(1).toLowerCase().replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="card-brand">
              {paginated.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                  <Receipt size={40} className="text-cream-dark" />
                  <p
                    className="mb-0 text-muted-brand"
                    style={{ fontSize: ".875rem" }}
                  >
                    No invoices match your criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                    }}
                    className="btn-ghost"
                    style={{
                      padding: "4px 12px",
                      fontSize: ".875rem",
                      color: "var(--amber-dark)",
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table-brand">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th className="d-none d-md-table-cell">Order</th>
                        <th className="d-none d-md-table-cell">Customer</th>
                        <th>Status</th>
                        <th className="text-end d-none d-sm-table-cell">
                          Subtotal
                        </th>
                        <th className="text-end d-none d-sm-table-cell">Tax</th>
                        <th className="text-end">Total</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((bill) => (
                        <tr key={bill.id}>
                          <td>
                            <Link
                              href={`/dashboard/billing/${bill.id}`}
                              className="fw-semibold text-decoration-none text-navy"
                              style={{ fontSize: ".875rem" }}
                            >
                              INV-{String(bill.id).padStart(5, "0")}
                            </Link>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span
                              className="text-muted-brand"
                              style={{ fontSize: ".875rem" }}
                            >
                              #{bill.orderId}
                            </span>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span
                              className="text-navy"
                              style={{ fontSize: ".875rem" }}
                            >
                              #{bill.customerId}
                            </span>
                          </td>
                          {/* Status cell – edit inline or show badge */}
                          <td>
                            {editingId === bill.id ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="input-brand"
                                style={{
                                  fontSize: ".8rem",
                                  padding: "2px 6px",
                                  minWidth: 140,
                                }}
                              >
                                {INVOICE_STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className="status-badge sm"
                                style={statusColor(bill.status)}
                              >
                                {bill.status}
                              </span>
                            )}
                          </td>
                          <td className="text-end d-none d-sm-table-cell">
                            <span style={{ fontSize: ".875rem" }}>
                              {formatCurrency(bill.subtotal)}
                            </span>
                          </td>
                          <td className="text-end d-none d-sm-table-cell">
                            <span style={{ fontSize: ".875rem" }}>
                              {formatCurrency(bill.tax)}
                            </span>
                          </td>
                          <td className="text-end">
                            <span
                              className="fw-semibold text-navy"
                              style={{ fontSize: ".875rem" }}
                            >
                              {formatCurrency(bill.totalAmount)}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="text-end">
                            {editingId === bill.id ? (
                              <div className="d-inline-flex align-items-center gap-1">
                                <button
                                  onClick={() => handleEditSave(bill.id)}
                                  disabled={editSaving}
                                  className="btn btn-success btn-sm py-0 px-2"
                                  style={{ fontSize: ".75rem" }}
                                >
                                  {editSaving ? "…" : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="btn-icon"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="d-inline-flex align-items-center gap-1">
                                {/* View */}
                                <Link
                                  href={`/dashboard/billing/${bill.id}`}
                                  className="btn-icon"
                                  title="View invoice"
                                >
                                  <Eye size={15} />
                                </Link>
                                {/* Edit */}
                                <button
                                  onClick={() => {
                                    setEditingId(bill.id);
                                    setEditStatus(bill.status);
                                  }}
                                  className="btn-icon"
                                  title="Edit status"
                                >
                                  <Pencil size={14} />
                                </button>
                                {/* Delete */}
                                {deleteConfirm === bill.id ? (
                                  <div className="d-flex align-items-center gap-1">
                                    <button
                                      onClick={() => handleDelete(bill.id)}
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
                                    onClick={() => setDeleteConfirm(bill.id)}
                                    className="btn-icon"
                                    title="Delete invoice"
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
                            )}
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
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-icon"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="btn-icon"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
