"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { paymentApi, type PaymentResponse } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  CreditCard,
  DollarSign,
  Receipt,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Trash2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export default function PaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPayment();
  }, [id]);

  async function loadPayment() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getById(Number(id));
      setPayment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(newStatus: "Pending" | "Success" | "Failed") {
    if (!payment || actionLoading) return;
    try {
      setActionLoading(true);
      await paymentApi.updateStatus(payment.paymentId, newStatus);
      await loadPayment();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!payment || actionLoading) return;
    if (!confirm("Are you sure you want to delete this payment? This action cannot be undone.")) return;
    try {
      setActionLoading(true);
      await paymentApi.delete(payment.paymentId);
      router.push("/dashboard/payments");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment");
      setActionLoading(false);
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

  const statusConfig = {
    Success: { 
      icon: CheckCircle2, 
      color: "#10b981", 
      bgColor: "rgba(16, 185, 129, 0.1)",
      label: "Success"
    },
    Failed: { 
      icon: XCircle, 
      color: "#ef4444", 
      bgColor: "rgba(239, 68, 68, 0.1)",
      label: "Failed"
    },
    Pending: { 
      icon: Clock, 
      color: "#f59e0b", 
      bgColor: "rgba(245, 158, 11, 0.1)",
      label: "Pending"
    },
  };

  const currentStatus = statusConfig[payment.status] || statusConfig.Pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <Link 
            href="/dashboard/payments" 
            className="d-inline-flex align-items-center gap-2 text-muted-brand mb-3"
            style={{ fontSize: ".875rem", textDecoration: "none" }}
          >
            <ArrowLeft size={16} />
            Back to Payments
          </Link>
          <h1 className="text-navy mb-1" style={{ fontSize: "2rem", fontWeight: 700 }}>
            Payment Details
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            Transaction Reference: <span className="fw-medium" style={{ fontFamily: "monospace" }}>
              {payment.transactionReference}
            </span>
          </p>
        </div>
        <div 
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          style={{ 
            background: currentStatus.bgColor,
            color: currentStatus.color,
            fontWeight: 600
          }}
        >
          <StatusIcon size={20} />
          {currentStatus.label}
        </div>
      </div>

      <div className="row g-4">
        {/* Main Payment Information Card */}
        <div className="col-lg-8">
          <div className="bg-surface rounded-3 border-brand p-4 mb-4" style={{ border: "1px solid" }}>
            <h2 className="text-navy mb-4" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              Payment Information
            </h2>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--navy-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <Receipt size={20} color="var(--navy)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Payment ID
                    </p>
                    <p className="text-navy mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                      #{payment.paymentId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--amber-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <DollarSign size={20} color="var(--amber-dark)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Amount Paid
                    </p>
                    <p className="text-navy mb-0" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10b981" }}>
                      LKR {payment.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--steel-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <FileText size={20} color="var(--steel)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Invoice ID
                    </p>
                    <Link 
                      href={`/dashboard/billing/${payment.invoiceId}`}
                      className="d-inline-block text-amber-dark"
                      style={{ fontSize: "1rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      #{payment.invoiceId}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--navy-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <User size={20} color="var(--navy)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Customer ID
                    </p>
                    <p className="text-navy mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                      #{payment.customerId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--steel-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <CreditCard size={20} color="var(--steel)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Payment Method
                    </p>
                    <p className="text-navy mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                      {payment.paymentMethodName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--amber-subtle)",
                      flexShrink: 0
                    }}
                  >
                    <Calendar size={20} color="var(--amber-dark)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                      Payment Date
                    </p>
                    <p className="text-navy mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                      {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gateway Response */}
          {payment.gatewayResponse && (
            <div className="bg-surface rounded-3 border-brand p-4 mb-4" style={{ border: "1px solid" }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={18} color="var(--steel)" />
                <h3 className="text-navy mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                  Gateway Response
                </h3>
              </div>
              <div 
                className="p-3 rounded-2"
                style={{ 
                  background: "var(--cream-light)",
                  fontFamily: "monospace",
                  fontSize: ".875rem",
                  color: "var(--navy-dark)",
                  overflowX: "auto"
                }}
              >
                {payment.gatewayResponse}
              </div>
            </div>
          )}

          {/* Refund Information */}
          {payment.refundAmount && (
            <div 
              className="rounded-3 p-4 mb-4"
              style={{ 
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <RotateCcw size={18} color="#ef4444" />
                <h3 className="mb-0" style={{ fontSize: "1rem", fontWeight: 600, color: "#ef4444" }}>
                  Refund Information
                </h3>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                    Refund Amount
                  </p>
                  <p className="mb-0" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ef4444" }}>
                    LKR {payment.refundAmount.toFixed(2)}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                    Refund Date
                  </p>
                  <p className="text-navy mb-0" style={{ fontSize: ".875rem", fontWeight: 600 }}>
                    {payment.refundDate 
                      ? new Date(payment.refundDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="text-muted-brand mb-1" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                    Refund Reason
                  </p>
                  <p className="text-navy mb-0" style={{ fontSize: ".875rem", fontWeight: 600 }}>
                    {payment.refundReason || "No reason provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="col-lg-4">
          <div className="bg-surface rounded-3 border-brand p-4" style={{ border: "1px solid" }}>
            <h3 className="text-navy mb-4" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              Actions
            </h3>
            
            <div className="d-flex flex-column gap-3">
              {payment.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("Success")}
                    disabled={actionLoading}
                    className="btn d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: ".875rem",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      opacity: actionLoading ? 0.6 : 1
                    }}
                  >
                    <CheckCircle2 size={18} />
                    Mark as Success
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("Failed")}
                    disabled={actionLoading}
                    className="btn d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: ".875rem",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      opacity: actionLoading ? 0.6 : 1
                    }}
                  >
                    <XCircle size={18} />
                    Mark as Failed
                  </button>
                </>
              )}
              
              {/* {payment.status === "Success" && !payment.refundAmount && (
                <Link
                  href={`/dashboard/payments/${payment.paymentId}/refund`}
                  className="btn d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#f97316",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: ".875rem",
                    textDecoration: "none"
                  }}
                >
                  <RotateCcw size={18} />
                  Process Refund
                </Link>
              )} */}

              <div 
                className="my-2" 
                style={{ height: "1px", background: "var(--border-color)" }}
              />

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="btn d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: "white",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: ".875rem",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                <Trash2 size={18} />
                Delete Payment
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
              <h4 className="text-navy mb-3" style={{ fontSize: ".875rem", fontWeight: 600 }}>
                Quick Summary
              </h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted-brand" style={{ fontSize: ".75rem" }}>Status</span>
                  <span 
                    className="px-2 py-1 rounded"
                    style={{ 
                      fontSize: ".75rem",
                      fontWeight: 600,
                      background: currentStatus.bgColor,
                      color: currentStatus.color
                    }}
                  >
                    {payment.status}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted-brand" style={{ fontSize: ".75rem" }}>Method ID</span>
                  <span className="text-navy" style={{ fontSize: ".75rem", fontWeight: 600 }}>
                    #{payment.paymentMethodId}
                  </span>
                </div>
                {payment.refundAmount && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-brand" style={{ fontSize: ".75rem" }}>Refunded</span>
                    <span style={{ fontSize: ".75rem", fontWeight: 600, color: "#ef4444" }}>
                      LKR {payment.refundAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
