"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { paymentApi, type PaymentResponse } from "@/lib/api";

export default function RefundPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayment();
  }, [params.id]);

  async function loadPayment() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getById(Number(params.id));
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

    if (!confirm(`Are you sure you want to refund $${amount.toFixed(2)}?`)) return;

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

  if (payment.status !== "Success") {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
          Only successful payments can be refunded. This payment has status: {payment.status}
        </div>
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to Payment Details
        </Link>
      </div>
    );
  }

  if (payment.refundAmount) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
          This payment has already been refunded.
        </div>
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to Payment Details
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/dashboard/payments/${payment.paymentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payment Details
        </Link>
      </div>

      <div className="max-w-2xl bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Process Refund</h1>

        {/* Payment Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Payment ID:</span>
              <span className="ml-2 font-semibold">#{payment.paymentId}</span>
            </div>
            <div>
              <span className="text-gray-500">Transaction Ref:</span>
              <span className="ml-2 font-mono">{payment.transactionReference}</span>
            </div>
            <div>
              <span className="text-gray-500">Original Amount:</span>
              <span className="ml-2 font-bold text-green-600">${payment.amount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-500">Payment Date:</span>
              <span className="ml-2">{new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Refund Form */}
        <form onSubmit={handleRefund}>
          <div className="mb-4">
            <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount *
            </label>
            <input
              type="number"
              id="refundAmount"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              step="0.01"
              min="0.01"
              max={payment.amount}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 text-sm text-gray-500">
              Maximum refundable amount: ${payment.amount.toFixed(2)}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="refundReason" className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason
            </label>
            <textarea
              id="refundReason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the reason for this refund..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {processing ? "Processing..." : "Process Refund"}
            </button>
            <Link
              href={`/dashboard/payments/${payment.paymentId}`}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
