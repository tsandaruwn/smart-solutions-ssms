"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Receipt } from "lucide-react";
import { billingApi, type Bill, type UpdateBillRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const invoiceId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [bill, setBill] = useState<Bill | null>(null);
  const [subtotal, setSubtotal] = useState("");
  const [tax, setTax] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await billingApi.getById(invoiceId);
        if (data.status === "PAID") {
          setLoadError("Paid invoices cannot be edited.");
          setLoading(false);
          return;
        }
        setBill(data);
        setSubtotal(String(data.subtotal));
        setTax(String(data.tax));
        setTotalAmount(String(data.totalAmount));
        setStatus(data.status);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    if (invoiceId) load();
  }, [invoiceId]);

  useEffect(() => {
    const sub = Number(subtotal) || 0;
    const t = Number(tax) || 0;
    setTotalAmount(String(sub + t));
  }, [subtotal, tax]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updates: UpdateBillRequest = {
        subtotal: Number(subtotal),
        tax: Number(tax),
        totalAmount: Number(totalAmount),
        status,
      };
      await billingApi.update(invoiceId, updates);
      router.push(`/dashboard/billing/${invoiceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update invoice");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading invoice..." />;
  if (loadError) return <ErrorMessage message={loadError} />;
  if (!bill) return <ErrorMessage message="Invoice not found" />;

  return (
    <div style={{ maxWidth: 700 }}>
      <Link href={`/dashboard/billing/${invoiceId}`} className="back-link mb-3 d-inline-flex">
        <ArrowLeft size={16} /> Back to Invoice
      </Link>

      <div className="mb-4">
        <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
          Edit Invoice INV-{String(bill.id).padStart(5, "0")}
        </h1>
        <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
          Order #{bill.orderId} &bull; Customer #{bill.customerId}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4" style={{ fontSize: ".875rem" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
              <Receipt size={16} className="text-steel" /> Invoice Details
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Status <span className="text-danger">*</span>
                </label>
                <select required value={status} onChange={(e) => setStatus(e.target.value)} className="input-brand">
                  <option value="PENDING">Pending</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Subtotal <span className="text-danger">*</span>
                </label>
                <input type="number" required min="0" step="0.01" value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)} className="input-brand" />
              </div>
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Tax <span className="text-danger">*</span>
                </label>
                <input type="number" required min="0" step="0.01" value={tax}
                  onChange={(e) => setTax(e.target.value)} className="input-brand" />
              </div>
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>Total Amount</label>
                <input type="number" readOnly value={totalAmount} className="input-brand" style={{ opacity: 0.7 }} />
                <small className="text-muted-brand">Auto-calculated from subtotal + tax</small>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card-brand mb-4" style={{ background: "rgba(242,238,234,.5)" }}>
          <div className="card-brand-body">
            <p className="fw-medium text-muted-brand mb-2" style={{ fontSize: ".8125rem" }}>Current values</p>
            <div className="d-flex flex-wrap gap-3" style={{ fontSize: ".8125rem" }}>
              <span className="text-muted-brand">Subtotal: <strong className="text-navy">{formatCurrency(bill.subtotal)}</strong></span>
              <span className="text-muted-brand">Tax: <strong className="text-navy">{formatCurrency(bill.tax)}</strong></span>
              <span className="text-muted-brand">Total: <strong className="text-navy">{formatCurrency(bill.totalAmount)}</strong></span>
              <span className="text-muted-brand">Status: <strong className="text-navy">{bill.status}</strong></span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-end gap-3">
          <Link href={`/dashboard/billing/${invoiceId}`} className="btn-ghost">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-amber">
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
