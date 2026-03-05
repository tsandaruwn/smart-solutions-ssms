"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { paymentApi, type PaymentResponse } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ArrowLeft, RotateCcw, AlertCircle } from "lucide-react";

export default function RefundPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayment();
  }, [id]);

  async function loadPayment() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getById(Number(id));
      setPayment(data);
      setRefundAmount(data.amount.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefund(e: React.FormEvent) {
    e.preventDefault();
    if (!payment) return;

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid refund amount");
      return;
    }

    if (amount > payment.amount) {
      alert("Refund amount cannot exceed the original payment amount");
      return;
    }

    if (!confirm(`Are you sure you want to refund LKR ${amount.toFixed(2)}?`)) return;

    try {
      setProcessing(true);
      await paymentApi.processRefund(payment.paymentId, refundReason, amount);
      router.push(`/dashboard/payments/${payment.paymentId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to process refund");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
        <LoadingSpinner message="Loading payment details..." />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div style={{ padding: "2rem" }}>
        <ErrorMessage message={error || "Payment not found"} onRetry={loadPayment} />
        <div className="text-center mt-4">
          <Link href="/dashboard/payments" className="btn-navy">
            <ArrowLeft size={16} style={{ marginRight: "8px" }} />
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  if (payment.status !== "Success") {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertCircle size={20} />
          Only successful payments can be refunded. This payment has status: <strong>{payment.status}</strong>
        </div>
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="btn-navy d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Payment Details
        </Link>
      </div>
    );
  }

  if (payment.refundAmount) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertCircle size={20} />
          This payment has already been refunded.
        </div>
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="btn-navy d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Payment Details
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="d-inline-flex align-items-center gap-2 text-muted-brand"
          style={{ fontSize: ".875rem", textDecoration: "none" }}
        >
          <ArrowLeft size={16} />
          Back to Payment Details
        </Link>
      </div>

      <div className="bg-surface rounded-3 border-brand p-4" style={{ border: "1px solid" }}>
        <h1 className="text-navy mb-4 d-flex align-items-center gap-2" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          <RotateCcw size={28} />
          Process Refund
        </h1>

        {/* Payment Summary */}
        <div className="bg-cream-light rounded-3 p-3 mb-4">
          <h3 className="text-navy mb-3" style={{ fontSize: "1rem", fontWeight: 600 }}>
            Payment Information
          </h3>
          <div className="row g-3">
            <div className="col-sm-6">
              <span className="text-muted-brand" style={{ fontSize: ".8rem" }}>Payment ID:</span>
              <span className="ms-2 fw-semibold text-navy">#{payment.paymentId}</span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted-brand" style={{ fontSize: ".8rem" }}>Transaction Ref:</span>
              <span className="ms-2" style={{ fontFamily: "monospace" }}>{payment.transactionReference}</span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted-brand" style={{ fontSize: ".8rem" }}>Original Amount:</span>
              <span className="ms-2 fw-bold" style={{ color: "#10b981" }}>LKR {payment.amount.toFixed(2)}</span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted-brand" style={{ fontSize: ".8rem" }}>Payment Date:</span>
              <span className="ms-2">{new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Refund Form */}
        <form onSubmit={handleRefund}>
          <div className="mb-3">
            <label htmlFor="refundAmount" className="form-label fw-medium text-navy">
              Refund Amount *
            </label>
            <input
              type="number"
              id="refundAmount"
              className="form-control"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              step="0.01"
              min="0.01"
              max={payment.amount}
              required
            />
            <div className="form-text">
              Maximum refundable amount: LKR {payment.amount.toFixed(2)}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="refundReason" className="form-label fw-medium text-navy">
              Refund Reason
            </label>
            <textarea
              id="refundReason"
              className="form-control"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={4}
              placeholder="Enter the reason for this refund..."
            />
          </div>

          <div className="d-flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="btn-amber d-inline-flex align-items-center gap-2"
            >
              <RotateCcw size={16} />
              {processing ? "Processing..." : "Process Refund"}
            </button>
            <Link
              href={`/dashboard/payments/${payment.paymentId}`}
              className="btn-steel"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
