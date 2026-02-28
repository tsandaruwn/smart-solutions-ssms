"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Package,
} from "lucide-react";
import { orderApi, type OrderResponse, type OrderStatus } from "@/lib/api";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter((o) => o.status === "PENDING").length;
  const shippedOrders   = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const totalRevenue    = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 8);

  const statusDistribution: { status: OrderStatus; count: number; color: string }[] = [
    { status: "PENDING",   count: pendingOrders,   color: "var(--amber)" },
    { status: "SHIPPED",   count: shippedOrders,   color: "var(--steel)" },
    { status: "DELIVERED", count: deliveredOrders, color: "#22c55e" },
    { status: "CANCELLED", count: cancelledOrders, color: "#ef4444" },
  ];
  const maxCount = Math.max(...statusDistribution.map((s) => s.count), 1);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>Dashboard Overview</h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            Welcome back! Here&apos;s what&apos;s happening with your orders.
          </p>
        </div>
        <Link href="/dashboard/orders/create" className="btn-amber">
          <ShoppingCart size={16} />
          New Order
        </Link>
      </div>

      {/* Backend warning */}
      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            <strong>Backend not connected</strong> &mdash; Start the Order Management service on port 8085 to see live data.
          </p>
          <button onClick={fetchOrders} className="btn-ghost ms-auto" style={{ padding: "4px 12px", fontSize: ".75rem" }}>
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Total Orders"   value={totalOrders}              subtitle="All time orders"        icon={ShoppingCart} color="navy"  />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Total Revenue"  value={formatCurrency(totalRevenue)} subtitle="Excluding cancelled" icon={DollarSign}   color="amber" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Pending Orders" value={pendingOrders}            subtitle="Awaiting processing"   icon={Clock}        color="steel" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Delivered"      value={deliveredOrders}          subtitle="Successfully delivered" icon={CheckCircle}  color="green" />
        </div>
      </div>

      {/* Main content */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-12 col-lg-8">
          <div className="card-brand">
            <div className="card-brand-header">
              <span className="fw-semibold text-navy" style={{ fontSize: ".9375rem" }}>Recent Orders</span>
              <Link href="/dashboard/orders" className="d-inline-flex align-items-center gap-1 text-muted-brand text-decoration-none" style={{ fontSize: ".875rem" }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                <Package size={40} className="text-cream-dark" />
                <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem" }}>No orders yet</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table-brand">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th className="d-none d-sm-table-cell">Date</th>
                      <th>Status</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>
                          <Link href={`/dashboard/orders/${order.orderId}`} className="fw-semibold text-decoration-none text-navy" style={{ fontSize: ".875rem" }}>
                            {order.orderNumber}
                          </Link>
                          <p className="mb-0 text-muted-brand" style={{ fontSize: ".75rem" }}>Customer #{order.customerId}</p>
                        </td>
                        <td className="d-none d-sm-table-cell">
                          <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{getRelativeTime(order.orderDate)}</span>
                        </td>
                        <td><StatusBadge status={order.status} size="sm" /></td>
                        <td className="text-end">
                          <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>{formatCurrency(order.totalAmount || 0)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-12 col-lg-4">
          <div className="card-brand">
            <div className="card-brand-body">
              <h2 className="fw-semibold text-navy mb-4" style={{ fontSize: ".9375rem" }}>Order Status</h2>
              <div className="d-flex flex-column gap-3">
                {statusDistribution.map(({ status, count, color }) => (
                  <div key={status}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <StatusBadge status={status} size="sm" />
                      <span className="fw-bold text-navy" style={{ fontSize: ".875rem" }}>{count}</span>
                    </div>
                    <div className="progress-brand">
                      <div className="progress-brand-bar" style={{ width: `${totalOrders === 0 ? 0 : (count / maxCount) * 100}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                {[
                  { label: "Success Rate",     value: totalOrders === 0 ? "0%" : `${Math.round((deliveredOrders / totalOrders) * 100)}%` },
                  { label: "Cancel Rate",      value: totalOrders === 0 ? "0%" : `${Math.round((cancelledOrders / totalOrders) * 100)}%` },
                  { label: "Avg. Order Value", value: totalOrders === 0 ? formatCurrency(0) : formatCurrency(totalRevenue / (totalOrders - cancelledOrders || 1)) },
                ].map(({ label, value }) => (
                  <div key={label} className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{label}</span>
                    <span className="fw-bold text-navy"    style={{ fontSize: ".875rem" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
