"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Calendar, Package, Hash, FileText, Truck, CheckCircle, XCircle, Edit } from "lucide-react";
import { orderApi, type OrderResponse, type OrderStatus } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (orderId) fetchOrder(); }, [orderId]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setActionLoading(true);
    try {
      const result = await orderApi.updateStatus(orderId, { status: newStatus });
      if (result.order) setOrder(result.order);
      else await fetchOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const result = await orderApi.cancel(orderId, { cancellationReason: cancelReason || undefined });
      if (result.order) setOrder(result.order);
      else await fetchOrder();
      setShowCancelModal(false);
      setCancelReason("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading order details..." />;
  if (error)   return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order)  return <ErrorMessage message="Order not found" />;

  const canShip    = order.status === "PENDING";
  const canDeliver = order.status === "SHIPPED";
  const canCancel  = order.status === "PENDING";

  return (
    <div style={{ maxWidth: 1100 }}>
      <Link href="/dashboard/orders" className="back-link mb-3 d-inline-flex">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1 className="fw-bold text-navy mb-0" style={{ fontSize: "1.5rem" }}>{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-muted-brand mb-0 mt-1" style={{ fontSize: ".875rem" }}>
            Order placed on {formatDateTime(order.orderDate)}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {order.status === "PENDING" && (
            <Link href={`/dashboard/orders/${orderId}/edit`} className="btn-amber d-flex align-items-center gap-2">
              <Edit size={15} /> Edit Order
            </Link>
          )}
          {canShip && (
            <button onClick={() => handleUpdateStatus("SHIPPED")} disabled={actionLoading} className="btn-steel">
              <Truck size={15} /> Mark Shipped
            </button>
          )}
          {canDeliver && (
            <button onClick={() => handleUpdateStatus("DELIVERED")} disabled={actionLoading}
              className="btn-navy" style={{ background: "#16a34a" }}>
              <CheckCircle size={15} /> Mark Delivered
            </button>
          )}
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} disabled={actionLoading}
              className="btn-navy" style={{ background: "#ef4444" }}>
              <XCircle size={15} /> Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-brand mb-4">
            <div className="card-brand-header">
              <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
                <Package size={16} /> Order Items
              </h2>
            </div>
            <div className="table-responsive">
              <table className="table-brand">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end d-none d-sm-table-cell">Discount</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.orderItemId}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-cream-light d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: 36, height: 36 }}>
                            <Hash size={15} className="text-steel" />
                          </div>
                          <span className="fw-medium text-navy" style={{ fontSize: ".875rem" }}>Product #{item.productId}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="fw-medium text-navy" style={{ fontSize: ".875rem" }}>{item.quantity}</span>
                      </td>
                      <td className="text-end">
                        <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{formatCurrency(item.unitPriceAtOrder)}</span>
                      </td>
                      <td className="text-end d-none d-sm-table-cell">
                        <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{item.discountPercent > 0 ? `${item.discountPercent}%` : "—"}</span>
                      </td>
                      <td className="text-end">
                        <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>{formatCurrency(item.lineTotal)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-end fw-semibold text-navy" style={{ fontSize: ".875rem" }}>Total Amount</td>
                    <td className="text-end fw-bold text-navy" style={{ fontSize: "1.125rem" }}>{formatCurrency(order.totalAmount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="card-brand mb-4">
              <div className="card-brand-header">
                <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
                  <FileText size={16} /> Notes
                </h2>
              </div>
              <div className="card-brand-body">
                <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem", lineHeight: 1.6 }}>{order.notes}</p>
              </div>
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="rounded-3 p-4" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <h2 className="fw-semibold d-flex align-items-center gap-2 mb-3" style={{ fontSize: ".9375rem", color: "#b91c1c" }}>
                <XCircle size={16} /> Cancellation Details
              </h2>
              {order.cancelledAt && (
                <p className="mb-1" style={{ fontSize: ".875rem", color: "#dc2626" }}>Cancelled on: {formatDateTime(order.cancelledAt)}</p>
              )}
              {order.cancellationReason && (
                <p className="mb-0" style={{ fontSize: ".875rem", color: "#dc2626" }}>Reason: {order.cancellationReason}</p>
              )}
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4">
          <div className="card-brand mb-3">
            <div className="card-brand-body">
              <h3 className="fw-semibold text-navy d-flex align-items-center gap-2 mb-3" style={{ fontSize: ".875rem" }}>
                <User size={15} className="text-steel" /> Customer Info
              </h3>
              <div className="mb-2">
                <p className="text-uppercase text-muted-brand mb-1" style={{ fontSize: ".65rem", letterSpacing: ".05em" }}>Customer ID</p>
                <p className="fw-medium text-navy mb-0" style={{ fontSize: ".875rem" }}>#{order.customerId}</p>
              </div>
              {order.createdByUserId && (
                <div>
                  <p className="text-uppercase text-muted-brand mb-1" style={{ fontSize: ".65rem", letterSpacing: ".05em" }}>Created By</p>
                  <p className="fw-medium text-navy mb-0" style={{ fontSize: ".875rem" }}>User #{order.createdByUserId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-brand mb-3">
            <div className="card-brand-body">
              <h3 className="fw-semibold text-navy d-flex align-items-center gap-2 mb-3" style={{ fontSize: ".875rem" }}>
                <MapPin size={15} className="text-steel" /> Shipping Address
              </h3>
              <p className="text-navy mb-1" style={{ fontSize: ".875rem" }}>{order.shippingAddress}</p>
              <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>{order.shippingCity}</p>
            </div>
          </div>

          <div className="card-brand">
            <div className="card-brand-body">
              <h3 className="fw-semibold text-navy d-flex align-items-center gap-2 mb-3" style={{ fontSize: ".875rem" }}>
                <Calendar size={15} className="text-steel" /> Timeline
              </h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-2">
                  <span className="timeline-dot bg-navy" />
                  <div>
                    <p className="text-muted-brand mb-0" style={{ fontSize: ".75rem" }}>Order Placed</p>
                    <p className="fw-medium text-navy mb-0" style={{ fontSize: ".875rem" }}>{formatDateTime(order.orderDate)}</p>
                  </div>
                </div>
                {order.updatedAt && order.updatedAt !== order.orderDate && (
                  <div className="d-flex align-items-start gap-2">
                    <span className="timeline-dot bg-steel" />
                    <div>
                      <p className="text-muted-brand mb-0" style={{ fontSize: ".75rem" }}>Last Updated</p>
                      <p className="fw-medium text-navy mb-0" style={{ fontSize: ".875rem" }}>{formatDateTime(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {order.cancelledAt && (
                  <div className="d-flex align-items-start gap-2">
                    <span className="timeline-dot" style={{ background: "#ef4444" }} />
                    <div>
                      <p className="text-muted-brand mb-0" style={{ fontSize: ".75rem" }}>Cancelled</p>
                      <p className="fw-medium mb-0" style={{ fontSize: ".875rem", color: "#dc2626" }}>{formatDateTime(order.cancelledAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <h2 className="fw-semibold text-navy mb-2" style={{ fontSize: "1.125rem" }}>Cancel Order</h2>
            <p className="text-muted-brand mb-3" style={{ fontSize: ".875rem" }}>
              Are you sure you want to cancel order <strong>{order.orderNumber}</strong>? This action cannot be undone.
            </p>
            <div className="mb-3">
              <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>Reason (optional)</label>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..." rows={3} className="textarea-brand" />
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <button onClick={() => { setShowCancelModal(false); setCancelReason(""); }} className="btn-ghost">Go Back</button>
              <button onClick={handleCancel} disabled={actionLoading} className="btn-navy" style={{ background: "#ef4444" }}>
                {actionLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
