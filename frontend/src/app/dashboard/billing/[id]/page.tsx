"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  User,
  Trash2,
  CheckCircle,
  Receipt,
} from "lucide-react";
import {
  billingApi,
  type Bill,
  type BillingCustomerDto,
  type BillingPaymentDto,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const invoiceId = Number(id);

  const [bill, setBill] = useState<Bill | null>(null);
  const [customer, setCustomer] = useState<BillingCustomerDto | null>(null);
  const [payments, setPayments] = useState<BillingPaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, c, p] = await Promise.all([
        billingApi.getById(invoiceId),
        billingApi.getCustomer(invoiceId).catch(() => null),
        billingApi.getPayments(invoiceId),
      ]);
      setBill(b);
      setCustomer(c);
      setPayments(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invoiceId]);

  const handleMarkPaid = async () => {
    if (!bill) return;
    const updated = await billingApi.update(invoiceId, { status: "PAID" });
    setBill(updated);
  };

  const handleDelete = async () => {
    await billingApi.delete(invoiceId);
    router.push("/dashboard/billing");
  };

  const statusStyle = (status: string) => {
    if (status === "PAID") return { background: "#d1fae5", color: "#065f46" };
    if (status === "PENDING")
      return { background: "#fef9c3", color: "#854d0e" };
    return { background: "#fee2e2", color: "#991b1b" };
  };

  if (loading) return <LoadingSpinner message="Loading invoice..." />;

  if (error || !bill) {
    return (
      <div className="warning-banner">
        <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
          {error || "Invoice not found"}
        </p>
        <button
          onClick={fetchData}
          className="btn-ghost ms-auto"
          style={{ padding: "4px 12px", fontSize: ".75rem" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = bill.totalAmount - totalPaid;

  return (
    <div>
      {/* Back + header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="btn-icon">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-grow-1">
          <h1 className="fw-bold text-navy mb-0" style={{ fontSize: "1.5rem" }}>
            INV-{String(bill.id).padStart(5, "0")}
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            Order #{bill.orderId}
          </p>
        </div>
        <span className="status-badge" style={statusStyle(bill.status)}>
          {bill.status}
        </span>
      </div>

      <div className="row g-4">
        {/* Invoice summary */}
        <div className="col-12 col-lg-6">
          <div className="card-brand p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Receipt size={18} className="text-amber-dark" />
              <h2
                className="fw-semibold text-navy mb-0"
                style={{ fontSize: "1rem" }}
              >
                Invoice Summary
              </h2>
            </div>

            <div
              className="d-flex justify-content-between py-2"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <span
                className="text-muted-brand"
                style={{ fontSize: ".875rem" }}
              >
                Subtotal
              </span>
              <span className="text-navy" style={{ fontSize: ".875rem" }}>
                {formatCurrency(bill.subtotal)}
              </span>
            </div>
            <div
              className="d-flex justify-content-between py-2"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <span
                className="text-muted-brand"
                style={{ fontSize: ".875rem" }}
              >
                Tax
              </span>
              <span className="text-navy" style={{ fontSize: ".875rem" }}>
                {formatCurrency(bill.tax)}
              </span>
            </div>
            <div
              className="d-flex justify-content-between py-2"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <span
                className="fw-semibold text-navy"
                style={{ fontSize: ".875rem" }}
              >
                Total
              </span>
              <span className="fw-bold text-navy" style={{ fontSize: "1rem" }}>
                {formatCurrency(bill.totalAmount)}
              </span>
            </div>
            <div
              className="d-flex justify-content-between py-2"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <span
                className="text-muted-brand"
                style={{ fontSize: ".875rem" }}
              >
                Paid
              </span>
              <span style={{ fontSize: ".875rem", color: "#16a34a" }}>
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span
                className="fw-semibold text-navy"
                style={{ fontSize: ".875rem" }}
              >
                Remaining
              </span>
              <span
                className="fw-bold"
                style={{
                  fontSize: ".875rem",
                  color: remaining > 0 ? "#dc2626" : "#16a34a",
                }}
              >
                {formatCurrency(remaining)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2 mt-3">
              {bill.status !== "PAID" && (
                <button
                  onClick={handleMarkPaid}
                  className="btn-amber d-flex align-items-center gap-2"
                >
                  <CheckCircle size={15} />
                  Mark Paid
                </button>
              )}
              {deleteConfirm ? (
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="text-muted-brand"
                    style={{ fontSize: ".875rem" }}
                  >
                    Delete?
                  </span>
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger btn-sm py-1 px-3"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="btn btn-secondary btn-sm py-1 px-3"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="btn-ghost d-flex align-items-center gap-2"
                  style={{ color: "#dc2626" }}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="col-12 col-lg-6">
          <div className="card-brand p-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <User size={18} className="text-amber-dark" />
              <h2
                className="fw-semibold text-navy mb-0"
                style={{ fontSize: "1rem" }}
              >
                Customer
              </h2>
            </div>
            {customer ? (
              <div>
                <p className="text-navy fw-semibold mb-1">{customer.name}</p>
                <p
                  className="text-muted-brand mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  {customer.email}
                </p>
                <p
                  className="text-muted-brand mb-0"
                  style={{ fontSize: ".75rem" }}
                >
                  ID #{customer.customerId}
                </p>
              </div>
            ) : (
              <p
                className="text-muted-brand mb-0"
                style={{ fontSize: ".875rem" }}
              >
                Customer #{bill.customerId}
              </p>
            )}
          </div>
        </div>

        {/* Payments table */}
        <div className="col-12">
          <div className="card-brand">
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <h2
                className="fw-semibold text-navy mb-0"
                style={{ fontSize: "1rem" }}
              >
                Payment History ({payments.length})
              </h2>
            </div>
            {payments.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                <CreditCard size={40} className="text-cream-dark" />
                <p
                  className="mb-0 text-muted-brand"
                  style={{ fontSize: ".875rem" }}
                >
                  No payments recorded yet
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table-brand">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Status</th>
                      <th>Timestamp</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.paymentId}>
                        <td>
                          <span
                            className="text-navy fw-semibold"
                            style={{ fontSize: ".875rem" }}
                          >
                            #{p.paymentId}
                          </span>
                        </td>
                        <td>
                          <span
                            className="status-badge sm"
                            style={statusStyle(p.status)}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className="text-muted-brand"
                            style={{ fontSize: ".875rem" }}
                          >
                            {p.timestamp
                              ? new Date(p.timestamp).toLocaleString()
                              : "—"}
                          </span>
                        </td>
                        <td className="text-end">
                          <span
                            className="fw-semibold text-navy"
                            style={{ fontSize: ".875rem" }}
                          >
                            {formatCurrency(p.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
