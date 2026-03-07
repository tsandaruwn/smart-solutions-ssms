"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CreditCard, CheckCircle, XCircle, Clock, Eye, Trash2 } from "lucide-react";
import { paymentApi, type PaymentResponse, type PaymentTransactionStatus } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<PaymentTransactionStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getAll();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await paymentApi.delete(id);
      await loadPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment");
    }
  }

  async function handleStatusChange(id: number, status: PaymentTransactionStatus) {
    try {
      await paymentApi.updateStatus(id, status);
      await loadPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "ALL" || payment.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      payment.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentMethodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentId.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  function getStatusBadgeClass(status: PaymentTransactionStatus): { background: string; color: string } {
    switch (status) {
      case "Success":
        return { background: "#d1fae5", color: "#065f46" };
      case "Failed":
        return { background: "#fee2e2", color: "#991b1b" };
      case "Pending":
        return { background: "#fef9c3", color: "#854d0e" };
      default:
        return { background: "var(--cream)", color: "var(--navy)" };
    }
  }

  function getStatusIcon(status: PaymentTransactionStatus) {
    switch (status) {
      case "Success":
        return <CheckCircle size={14} />;
      case "Failed":
        return <XCircle size={14} />;
      case "Pending":
        return <Clock size={14} />;
      default:
        return null;
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading payments..." />;
  }

  return (
    <div>
      {}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Payment Management
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            {filteredPayments.length} payment{filteredPayments.length === 1 ? "" : "s"} found
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/dashboard/payments/methods" className="btn-navy d-flex align-items-center gap-2">
            <CreditCard size={16} />
            Payment Methods
          </Link>
          <Link href="/dashboard/payments/process" className="btn-amber d-flex align-items-center gap-2">
            <CreditCard size={16} />
            Process Payment
          </Link>
        </div>
      </div>

      {}
      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            {error}
          </p>
        </div>
      )}

      {}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by ID, transaction ref, or method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
        <div className="filter-pill-group flex-shrink-0">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`filter-pill ${filterStatus === "ALL" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("Pending")}
            className={`filter-pill ${filterStatus === "Pending" ? "active" : ""}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("Success")}
            className={`filter-pill ${filterStatus === "Success" ? "active" : ""}`}
          >
            Success
          </button>
          <button
            onClick={() => setFilterStatus("Failed")}
            className={`filter-pill ${filterStatus === "Failed" ? "active" : ""}`}
          >
            Failed
          </button>
        </div>
      </div>

      {}
      <div className="card-brand">
        {filteredPayments.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <CreditCard size={48} className="text-cream-dark" />
            <p className="mb-1 text-muted-brand" style={{ fontSize: ".875rem" }}>
              No payments found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("ALL");
              }}
              className="btn-ghost"
              style={{ padding: "4px 12px", fontSize: ".875rem", color: "var(--amber-dark)" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transaction Ref</th>
                  <th className="d-none d-lg-table-cell">Customer</th>
                  <th className="d-none d-lg-table-cell">Invoice</th>
                  <th className="d-none d-md-table-cell">Method</th>
                  <th className="text-end">Amount</th>
                  <th className="d-none d-xl-table-cell">Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const statusStyle = getStatusBadgeClass(payment.status);
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <tr key={payment.paymentId}>
                      <td>
                        <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                          #{payment.paymentId}
                        </span>
                      </td>
                      <td>
                        <code className="text-muted-brand" style={{ fontSize: ".8rem" }}>
                          {payment.transactionReference}
                        </code>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <span className="text-navy" style={{ fontSize: ".875rem" }}>
                          Customer #{payment.customerId}
                        </span>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <Link
                          href={`/dashboard/billing/${payment.invoiceId}`}
                          className="text-decoration-none text-amber-dark fw-semibold"
                          style={{ fontSize: ".875rem" }}
                        >
                          INV-{String(payment.invoiceId).padStart(5, "0")}
                        </Link>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <span className="text-steel-dark" style={{ fontSize: ".875rem" }}>
                          {payment.paymentMethodName}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className="fw-bold text-navy" style={{ fontSize: ".875rem" }}>
                          LKR {payment.amount.toLocaleString()}
                        </span>
                        {payment.refundAmount && (
                          <div style={{ fontSize: ".7rem", color: "#dc2626", marginTop: 2 }}>
                            Refunded: LKR {payment.refundAmount.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="d-none d-xl-table-cell">
                        <span className="text-muted-brand" style={{ fontSize: ".75rem" }}>
                          {new Date(payment.paymentDate).toLocaleDateString()}<br />
                          {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge sm d-inline-flex align-items-center gap-1" style={statusStyle}>
                          {StatusIcon}
                          {payment.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            href={`/dashboard/payments/${payment.paymentId}`}
                            className="btn-icon"
                            title="View payment"
                          >
                            <Eye size={15} />
                          </Link>
                          {payment.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleStatusChange(payment.paymentId, "Success")}
                                className="btn-icon"
                                title="Approve payment"
                                style={{ color: "#16a34a" }}
                              >
                                <CheckCircle size={15} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(payment.paymentId, "Failed")}
                                className="btn-icon"
                                title="Reject payment"
                                style={{ color: "#dc2626" }}
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(payment.paymentId)}
                            className="btn-icon"
                            title="Delete payment"
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      <div className="row g-3 mt-4">
        <div className="col-6 col-md-3">
          <div className="card-brand p-3">
            <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Total Payments
            </p>
            <p className="fw-bold text-navy mb-0" style={{ fontSize: "1.5rem" }}>
              {filteredPayments.length}
            </p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-brand p-3" style={{ background: "#d1fae5" }}>
            <p className="mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", color: "#065f46" }}>
              Success
            </p>
            <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "#065f46" }}>
              {filteredPayments.filter((p) => p.status === "Success").length}
            </p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-brand p-3" style={{ background: "#fef9c3" }}>
            <p className="mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", color: "#854d0e" }}>
              Pending
            </p>
            <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "#854d0e" }}>
              {filteredPayments.filter((p) => p.status === "Pending").length}
            </p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-brand p-3" style={{ background: "#fee2e2" }}>
            <p className="mb-1" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", color: "#991b1b" }}>
              Failed
            </p>
            <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "#991b1b" }}>
              {filteredPayments.filter((p) => p.status === "Failed").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
