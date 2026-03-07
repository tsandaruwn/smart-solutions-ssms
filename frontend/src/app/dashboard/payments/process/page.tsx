"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CreditCard, AlertCircle } from "lucide-react";
import { paymentApi, paymentMethodApi, customerApi, billingApi, type PaymentRequest, type PaymentMethodResponse, type CustomerResponse, type Bill } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProcessPaymentPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [invoices, setInvoices] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PaymentRequest>({
    transactionReference: "",
    invoiceId: 0,
    customerId: 0,
    amount: 0,
    paymentMethodId: 0,
    gatewayResponse: "",
  });

  useEffect(() => {
    loadPaymentMethods();
    customerApi.getAll(0, 1000).then((res) => setCustomers(res.content)).catch(() => {});
    
    const txnRef = `TXN-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
    setFormData((prev) => ({ ...prev, transactionReference: txnRef }));
  }, []);

  async function loadPaymentMethods() {
    try {
      setLoading(true);
      const data = await paymentMethodApi.getActive();
      setPaymentMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof PaymentRequest, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (formData.invoiceId <= 0) {
      alert("Please enter a valid Invoice ID");
      return;
    }
    if (formData.customerId <= 0) {
      alert("Please enter a valid Customer ID");
      return;
    }
    if (formData.paymentMethodId <= 0) {
      alert("Please select a payment method");
      return;
    }

    try {
      setSubmitting(true);
      const payment = await paymentApi.create(formData);
      router.push(`/dashboard/payments/${payment.paymentId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to process payment");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading payment form..." />;
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
        <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
          Process Payment
        </h1>
        <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
          Record a new payment transaction
        </p>
      </div>

      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            {error}
          </p>
        </div>
      )}

      {paymentMethods.length === 0 && (
        <div className="card-brand p-4 mb-4" style={{ background: "#fef9c3" }}>
          <div className="d-flex gap-2 align-items-start">
            <AlertCircle size={18} style={{ color: "#854d0e", marginTop: 2 }} />
            <div>
              <p className="fw-semibold mb-1" style={{ fontSize: ".875rem", color: "#854d0e" }}>
                No active payment methods found
              </p>
              <p className="mb-0" style={{ fontSize: ".8rem", color: "#854d0e" }}>
                Please create at least one payment method before processing payments.
                <Link href="/dashboard/payments/methods" className="ms-2 text-decoration-underline fw-semibold">
                  Manage Payment Methods
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card-brand p-4" style={{ maxWidth: 800 }}>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {}
            <div className="col-12">
              <label htmlFor="transactionReference" className="form-label-brand">
                Transaction Reference
              </label>
              <input
                type="text"
                id="transactionReference"
                value={formData.transactionReference}
                onChange={(e) => handleChange("transactionReference", e.target.value)}
                className="input-brand"
                placeholder="TXN-2026-12345"
                style={{ fontFamily: "monospace" }}
              />
              <small className="text-muted-brand d-block mt-1" style={{ fontSize: ".75rem" }}>
                Leave blank to auto-generate or enter a unique reference
              </small>
            </div>

            {}
            <div className="col-md-6">
              <label htmlFor="customerId" className="form-label-brand">
                Customer <span className="text-danger">*</span>
              </label>
              <select
                id="customerId"
                value={formData.customerId || ""}
                onChange={(e) => {
                  const cid = parseInt(e.target.value) || 0;
                  handleChange("customerId", cid);
                  handleChange("invoiceId", 0);
                  setInvoices([]);
                  if (cid > 0) {
                    billingApi.getByCustomer(cid).then(setInvoices).catch(() => {});
                  }
                }}
                required
                className="input-brand"
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.firstName} {c.lastName} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="invoiceId" className="form-label-brand">
                Invoice <span className="text-danger">*</span>
              </label>
              <select
                id="invoiceId"
                value={formData.invoiceId || ""}
                onChange={(e) => handleChange("invoiceId", parseInt(e.target.value) || 0)}
                required
                className="input-brand"
                disabled={invoices.length === 0 && formData.customerId > 0}
              >
                <option value="">{formData.customerId ? (invoices.length ? "Select invoice" : "No invoices found") : "Select customer first"}</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    INV-{String(inv.id).padStart(5, "0")} — Order #{inv.orderId} — LKR {inv.totalAmount.toLocaleString()} ({inv.status})
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="col-md-6">
              <label htmlFor="amount" className="form-label-brand">
                Payment Amount <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "var(--cream-light)", border: "1px solid var(--border-color)", color: "var(--steel)" }}>
                  LKR
                </span>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount || ""}
                  onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0.01"
                  required
                  className="form-control input-brand"
                  placeholder="0.00"
                  style={{ borderLeft: "none" }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="paymentMethodId" className="form-label-brand">
                Payment Method <span className="text-danger">*</span>
              </label>
              <select
                id="paymentMethodId"
                value={formData.paymentMethodId || ""}
                onChange={(e) => handleChange("paymentMethodId", parseInt(e.target.value) || 0)}
                required
                className="input-brand"
              >
                <option value="">Select a payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method.paymentMethodId} value={method.paymentMethodId}>
                    {method.methodName} ({method.type.replace("_", " ")})
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="col-12">
              <label htmlFor="gatewayResponse" className="form-label-brand">
                Gateway Response (Optional)
              </label>
              <textarea
                id="gatewayResponse"
                value={formData.gatewayResponse}
                onChange={(e) => handleChange("gatewayResponse", e.target.value)}
                rows={3}
                className="input-brand"
                placeholder="Enter gateway response details..."
                style={{ fontFamily: "monospace", fontSize: ".875rem" }}
              />
            </div>

            {}
            <div className="col-12 d-flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting || paymentMethods.length === 0}
                className="btn-amber d-flex align-items-center gap-2"
              >
                <CreditCard size={16} />
                {submitting ? "Processing..." : "Process Payment"}
              </button>
              <Link href="/dashboard/payments" className="btn-ghost">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
