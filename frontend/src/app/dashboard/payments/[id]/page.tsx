"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { paymentApi, type PaymentResponse } from "@/lib/api";

export default function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayment();
  }, [params.id]);

  async function loadPayment() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getById(Number(params.id));
      setPayment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(newStatus: "Pending" | "Success" | "Failed") {
    if (!payment) return;
    try {
      await paymentApi.updateStatus(payment.paymentId, newStatus);
      await loadPayment();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDelete() {
    if (!payment) return;
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await paymentApi.delete(payment.paymentId);
      router.push("/dashboard/payments");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading payment details...</div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || "Payment not found"}
        </div>
        <Link href="/dashboard/payments" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Payments
        </Link>
      </div>
    );
  }

  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/payments" className="text-blue-600 hover:underline">
          ← Back to Payments
        </Link>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <span className={`px-3 py-1 text-sm font-semibold rounded ${getStatusBadgeClass(payment.status)}`}>
            {payment.status}
          </span>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Payment ID</label>
            <div className="text-lg font-semibold">#{payment.paymentId}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Transaction Reference</label>
            <div className="text-lg font-mono">{payment.transactionReference}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Invoice ID</label>
            <Link href={`/dashboard/billing/${payment.invoiceId}`} className="text-lg text-blue-600 hover:underline">
              #{payment.invoiceId}
            </Link>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Customer ID</label>
            <div className="text-lg">#{payment.customerId}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
            <div className="text-lg">{payment.paymentMethodName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
            <div className="text-2xl font-bold text-green-600">${payment.amount.toFixed(2)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Payment Date</label>
            <div className="text-lg">{new Date(payment.paymentDate).toLocaleString()}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
            <div className="text-lg font-semibold">{payment.status}</div>
          </div>
        </div>

        {/* Gateway Response */}
        {payment.gatewayResponse && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-1">Gateway Response</label>
            <div className="p-3 bg-gray-50 rounded border text-sm font-mono">
              {payment.gatewayResponse}
            </div>
          </div>
        )}

        {/* Refund Information */}
        {payment.refundAmount && (
          <div className="mb-6 p-4 bg-orange-50 rounded border border-orange-200">
            <h3 className="text-lg font-semibold mb-3 text-orange-800">Refund Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Refund Amount</label>
                <div className="text-lg font-bold text-orange-600">${payment.refundAmount.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Refund Date</label>
                <div className="text-lg">
                  {payment.refundDate ? new Date(payment.refundDate).toLocaleString() : "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Refund Reason</label>
                <div className="text-lg">{payment.refundReason || "N/A"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          {payment.status === "Pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate("Success")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Success
              </button>
              <button
                onClick={() => handleStatusUpdate("Failed")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Mark as Failed
              </button>
            </>
          )}
          {payment.status === "Success" && !payment.refundAmount && (
            <Link
              href={`/dashboard/payments/${payment.paymentId}/refund`}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Process Refund
            </Link>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-auto"
          >
            Delete Payment
          </button>
        </div>
      </div>
    </div>
  );
}
