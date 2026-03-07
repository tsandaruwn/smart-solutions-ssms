"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Trash2, ChevronLeft, ChevronRight, Package, Edit } from "lucide-react";
import { orderApi, type OrderResponse, type OrderStatus } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS: (OrderStatus | "ALL")[] = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "ALL") result = result.filter((o) => o.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingCity?.toLowerCase().includes(q) ||
          o.shippingAddress?.toLowerCase().includes(q) ||
          String(o.customerId).includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [statusFilter, searchQuery]);

  const handleDelete = async (orderId: number) => {
    try {
      await orderApi.delete(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div>
      {/* Backend warning */}
      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            <strong>Backend not connected</strong> &mdash; Start the Order Management service on port 8085 to see live data.
          </p>
          <button onClick={fetchOrders} className="btn-ghost ms-auto" style={{ padding: "4px 12px", fontSize: ".75rem" }}>Retry</button>
        </div>
      )}

      {/* Page header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>Order Management</h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link href="/dashboard/orders/create" className="btn-amber">
          <Plus size={16} />
          Create Order
        </Link>
      </div>

      {/* Filters */}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by order number, city, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
        <div className="filter-pill-group flex-shrink-0">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`filter-pill ${statusFilter === status ? "active" : ""}`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-brand">
        {paginatedOrders.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <Package size={48} className="text-cream-dark" />
            <p className="mb-1 text-muted-brand" style={{ fontSize: ".875rem" }}>No orders match your criteria</p>
            <button onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }} className="btn-ghost" style={{ padding: "4px 12px", fontSize: ".875rem", color: "var(--amber-dark)" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>Order</th>
                  <th className="d-none d-md-table-cell">Customer</th>
                  <th className="d-none d-lg-table-cell">City</th>
                  <th className="d-none d-sm-table-cell">Date</th>
                  <th>Status</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <Link href={`/dashboard/orders/${order.orderId}`} className="fw-semibold text-decoration-none text-navy" style={{ fontSize: ".875rem" }}>
                        {order.orderNumber}
                      </Link>
                      <p className="mb-0 d-sm-none text-muted-brand" style={{ fontSize: ".75rem" }}>{formatDateTime(order.orderDate)}</p>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span className="text-navy" style={{ fontSize: ".875rem" }}>Customer #{order.customerId}</span>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{order.shippingCity || "�"}</span>
                    </td>
                    <td className="d-none d-sm-table-cell">
                      <span className="text-muted-brand" style={{ fontSize: ".875rem" }}>{formatDateTime(order.orderDate)}</span>
                    </td>
                    <td><StatusBadge status={order.status} size="sm" /></td>
                    <td className="text-end">
                      <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>{formatCurrency(order.totalAmount || 0)}</span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <Link href={`/dashboard/orders/${order.orderId}`} className="btn-icon" title="View details">
                          <Eye size={15} />
                        </Link>
                        {order.status === "PENDING" && (
                          <Link href={`/dashboard/orders/${order.orderId}/edit`} className="btn-icon" title="Edit order" style={{ color: "var(--steel)" }}>
                            <Edit size={15} />
                          </Link>
                        )}
                        {deleteConfirm === order.orderId ? (
                          <div className="d-flex align-items-center gap-1">
                            <button onClick={() => handleDelete(order.orderId)} className="btn btn-danger btn-sm py-0 px-2" style={{ fontSize: ".75rem" }}>Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary btn-sm py-0 px-2" style={{ fontSize: ".75rem" }}>No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(order.orderId)} className="btn-icon" title="Delete order" style={{ color: "var(--steel)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--steel)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ borderTop: "1px solid var(--border-color)", background: "rgba(242,238,234,.3)" }}>
            <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem" }}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}�{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="d-flex align-items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="page-btn">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`page-btn ${currentPage === page ? "active" : ""}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="page-btn">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
