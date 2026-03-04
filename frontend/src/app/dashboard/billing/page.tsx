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
  Plus,
  CheckCircle,
} from "lucide-react";
import { billingApi, type Bill, type BillDto } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "PARTIALLY_PAID"] as const;

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<string>("");

  // generate invoice state
  const [genOrderId, setGenOrderId] = useState<string>("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState<BillDto | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const orderId = Number(genOrderId);
    if (!orderId || orderId <= 0) return;
    setGenLoading(true);
    setGenResult(null);
    setGenError(null);
    try {
      const result = await billingApi.generateInvoice(orderId);
      setGenResult(result);
      // auto-reload bills list if customer is already loaded
      if (customerId) fetchBills();
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Failed to generate invoice",
      );
    } finally {
      setGenLoading(false);
    }
  };

  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const id = Number(customerId);
      const data = id > 0 ? await billingApi.getByCustomer(id) : [];
      setBills(data);
      if (!id) setError("Enter a customer ID above to load invoices.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredBills = useMemo(() => {
    let result = bills;
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
  }, [bills, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE);
  const paginated = filteredBills.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await billingApi.delete(id);
      setBills((prev) => prev.filter((b) => b.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const statusColor = (status: string) => {
    if (status === "PAID") return { background: "#d1fae5", color: "#065f46" };
    if (status === "PENDING")
      return { background: "#fef9c3", color: "#854d0e" };
    return { background: "#fee2e2", color: "#991b1b" };
  };

  return (
    <div>
      {/* Page header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Billing &amp; Invoices
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            {filteredBills.length} invoice
            {filteredBills.length === 1 ? "" : "s"} found
          </p>
        </div>
        <button
          onClick={() => {
            setGenOrderId("");
            setGenResult(null);
            setGenError(null);
            (
              document.getElementById("gen-panel") as HTMLElement
            ).classList.toggle("d-none");
          }}
          className="btn-amber d-flex align-items-center gap-2"
        >
          <Plus size={16} />
          Generate Invoice
        </button>
      </div>

      {/* Customer lookup */}
      <div className="card-brand p-3 mb-4" id="gen-panel">
        <p
          className="fw-semibold text-navy mb-1"
          style={{ fontSize: ".875rem" }}
        >
          Generate Invoice from Order
        </p>
        <p className="text-muted-brand mb-2" style={{ fontSize: ".8rem" }}>
          Enter the Order ID from the order management service. A new invoice
          will be created automatically.
        </p>
        <div className="d-flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Order ID"
            value={genOrderId}
            onChange={(e) => setGenOrderId(e.target.value)}
            className="input-brand"
            style={{ maxWidth: 180 }}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={genLoading || !genOrderId}
            className="btn-amber"
            style={{ whiteSpace: "nowrap" }}
          >
            {genLoading ? "Generating…" : "Generate"}
          </button>
        </div>
        {genError && (
          <p className="mb-0" style={{ fontSize: ".8rem", color: "#dc2626" }}>
            {genError.includes("already exists")
              ? "⚠ An invoice already exists for this order."
              : `✕ ${genError}`}
          </p>
        )}
        {genResult && (
          <div
            className="d-flex align-items-center gap-2 mt-1 px-3 py-2 rounded-3"
            style={{ background: "#d1fae5", fontSize: ".875rem" }}
          >
            <CheckCircle size={15} style={{ color: "#16a34a" }} />
            <span style={{ color: "#065f46" }}>
              Invoice{" "}
              <strong>INV-{String(genResult.billId).padStart(5, "0")}</strong>{" "}
              created — Total{" "}
              <strong>Rs.{genResult.totalAmount.toLocaleString()}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Customer lookup */}
      <div className="card-brand p-3 mb-4">
        <p
          className="fw-semibold text-navy mb-2"
          style={{ fontSize: ".875rem" }}
        >
          Look up invoices by Customer ID
        </p>
        <div className="d-flex gap-2">
          <input
            type="number"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="input-brand"
            style={{ maxWidth: 180 }}
          />
          <button
            onClick={fetchBills}
            className="btn-amber"
            style={{ whiteSpace: "nowrap" }}
          >
            Load Invoices
          </button>
        </div>
      </div>

      {/* Warning / error */}
      {error && (
        <div className="warning-banner mb-4">
          <span
            className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0"
            style={{ width: 8, height: 8 }}
          />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            {error}
          </p>
          {customerId && (
            <button
              onClick={fetchBills}
              className="btn-ghost ms-auto"
              style={{ padding: "4px 12px", fontSize: ".75rem" }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading && <LoadingSpinner message="Loading invoices..." />}

      {!loading && bills.length > 0 && (
        <>
          {/* Filters */}
          <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <div className="search-wrapper flex-grow-1">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by invoice ID, order ID or customer ID..."
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
                    : s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="card-brand">
            {paginated.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                <Receipt size={48} className="text-cream-dark" />
                <p
                  className="mb-1 text-muted-brand"
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
                      <th className="text-end">Subtotal</th>
                      <th className="text-end">Tax</th>
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
                            Customer #{bill.customerId}
                          </span>
                        </td>
                        <td>
                          <span
                            className="status-badge sm"
                            style={statusColor(bill.status)}
                          >
                            {bill.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <span style={{ fontSize: ".875rem" }}>
                            {formatCurrency(bill.subtotal)}
                          </span>
                        </td>
                        <td className="text-end">
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
                        <td className="text-end">
                          <div className="d-inline-flex align-items-center gap-1">
                            <Link
                              href={`/dashboard/billing/${bill.id}`}
                              className="btn-icon"
                              title="View invoice"
                            >
                              <Eye size={15} />
                            </Link>
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
  );
}
