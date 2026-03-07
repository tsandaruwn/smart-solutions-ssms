"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import {
  inventoryApi,
  type InventoryResponse,
} from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;
const STOCK_FILTERS = ["ALL", "LOW_STOCK", "IN_STOCK"] as const;
type StockFilter = (typeof STOCK_FILTERS)[number];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getAll();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    let result = inventory;
    if (stockFilter === "LOW_STOCK") result = result.filter((i) => i.lowStock);
    if (stockFilter === "IN_STOCK") result = result.filter((i) => !i.lowStock);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          String(i.productId).includes(q) ||
          i.warehouse.name.toLowerCase().includes(q) ||
          i.warehouse.city?.toLowerCase().includes(q) ||
          String(i.inventoryId).includes(q)
      );
    }
    return result.sort((a, b) => b.inventoryId - a.inventoryId);
  }, [inventory, stockFilter, searchQuery]);

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [stockFilter, searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await inventoryApi.delete(id);
      setInventory((prev) => prev.filter((i) => i.inventoryId !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner message="Loading inventory..." />;

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((i) => i.lowStock).length;
  const totalStock = inventory.reduce((sum, i) => sum + i.quantityOnHand, 0);

  return (
    <div>
      {}
      {error && (
        <div className="warning-banner mb-4">
          <span
            className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0"
            style={{ width: 8, height: 8 }}
          />
          <p
            className="mb-0 text-amber-dark"
            style={{ fontSize: ".875rem" }}
          >
            <strong>Backend not connected</strong> &mdash; Start the Inventory
            Management service on port 8084 to see live data.
          </p>
          <button
            onClick={fetchInventory}
            className="btn-ghost ms-auto"
            style={{ padding: "4px 12px", fontSize: ".75rem" }}
          >
            Retry
          </button>
        </div>
      )}

      {}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1
            className="fw-bold text-navy mb-1"
            style={{ fontSize: "1.5rem" }}
          >
            Inventory Management
          </h1>
          <p
            className="text-muted-brand mb-0"
            style={{ fontSize: ".875rem" }}
          >
            {filteredInventory.length} record
            {filteredInventory.length !== 1 ? "s" : ""} found &middot;{" "}
            {totalStock.toLocaleString()} total units &middot;{" "}
            {lowStockItems > 0 && (
              <span style={{ color: "#ef4444" }}>
                <AlertTriangle
                  size={13}
                  style={{ verticalAlign: "-2px", marginRight: 2 }}
                />
                {lowStockItems} low stock
              </span>
            )}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/dashboard/inventory/warehouses" className="btn-navy">
            <Warehouse size={16} />
            Warehouses
          </Link>
          <Link href="/dashboard/inventory/create" className="btn-amber">
            <Plus size={16} />
            Add Record
          </Link>
        </div>
      </div>

      {}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <p
                  className="mb-1 fw-medium text-muted-brand"
                  style={{ fontSize: ".875rem" }}
                >
                  Total Records
                </p>
                <p
                  className="mb-0 fw-bold text-navy"
                  style={{ fontSize: "1.5rem" }}
                >
                  {totalItems}
                </p>
              </div>
              <div className="stat-icon" style={{ background: "var(--navy)", color: "#fff" }}>
                <Package size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <p
                  className="mb-1 fw-medium text-muted-brand"
                  style={{ fontSize: ".875rem" }}
                >
                  Total Units
                </p>
                <p
                  className="mb-0 fw-bold text-navy"
                  style={{ fontSize: "1.5rem" }}
                >
                  {totalStock.toLocaleString()}
                </p>
              </div>
              <div className="stat-icon" style={{ background: "var(--amber)", color: "var(--navy)" }}>
                <Warehouse size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <p
                  className="mb-1 fw-medium text-muted-brand"
                  style={{ fontSize: ".875rem" }}
                >
                  Low Stock Alerts
                </p>
                <p
                  className="mb-0 fw-bold"
                  style={{
                    fontSize: "1.5rem",
                    color: lowStockItems > 0 ? "#ef4444" : "var(--navy)",
                  }}
                >
                  {lowStockItems}
                </p>
              </div>
              <div className="stat-icon" style={{ background: "#ef4444", color: "#fff" }}>
                <AlertTriangle size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by product ID, warehouse name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
        <div className="filter-pill-group flex-shrink-0">
          {STOCK_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`filter-pill ${stockFilter === filter ? "active" : ""}`}
            >
              {filter === "ALL"
                ? "All"
                : filter === "LOW_STOCK"
                  ? "Low Stock"
                  : "In Stock"}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="card-brand">
        {paginatedInventory.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <Package size={48} className="text-cream-dark" />
            <p
              className="mb-1 text-muted-brand"
              style={{ fontSize: ".875rem" }}
            >
              No inventory records match your criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStockFilter("ALL");
              }}
              className="btn-ghost"
              style={{
                padding: "4px 12px",
                fontSize: ".875rem",
                color: "var(--amber-dark)",
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th className="d-none d-md-table-cell">City</th>
                  <th className="text-end">Qty</th>
                  <th className="d-none d-lg-table-cell text-end">Reorder Lvl</th>
                  <th>Status</th>
                  <th className="d-none d-md-table-cell">Updated</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((item) => (
                  <tr key={item.inventoryId}>
                    <td>
                      <span
                        className="fw-semibold text-navy"
                        style={{ fontSize: ".875rem" }}
                      >
                        #{item.inventoryId}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-navy"
                        style={{ fontSize: ".875rem" }}
                      >
                        Product #{item.productId}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-navy"
                        style={{ fontSize: ".875rem" }}
                      >
                        {item.warehouse.name}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {item.warehouse.city || "—"}
                      </span>
                    </td>
                    <td className="text-end">
                      <span
                        className="fw-semibold"
                        style={{
                          fontSize: ".875rem",
                          color: item.lowStock ? "#ef4444" : "var(--navy)",
                        }}
                      >
                        {item.quantityOnHand.toLocaleString()}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell text-end">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {item.reorderLevel}
                      </span>
                    </td>
                    <td>
                      {item.lowStock ? (
                        <span
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium"
                          style={{
                            fontSize: ".75rem",
                            background: "#fee2e2",
                            color: "#dc2626",
                          }}
                        >
                          <AlertTriangle size={11} />
                          Low Stock
                        </span>
                      ) : (
                        <span
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium"
                          style={{
                            fontSize: ".75rem",
                            background: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className="text-muted-brand"
                        style={{ fontSize: ".875rem" }}
                      >
                        {item.updatedAt
                          ? formatDateTime(item.updatedAt)
                          : "—"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <Link
                          href={`/dashboard/inventory/${item.inventoryId}`}
                          className="btn-icon"
                          title="View details"
                        >
                          <Eye size={15} />
                        </Link>
                        {deleteConfirm === item.inventoryId ? (
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => handleDelete(item.inventoryId)}
                              className="btn btn-danger btn-sm py-0 px-2"
                              style={{ fontSize: ".75rem" }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="btn btn-secondary btn-sm py-0 px-2"
                              style={{ fontSize: ".75rem" }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setDeleteConfirm(item.inventoryId)
                            }
                            className="btn-icon"
                            title="Delete record"
                            style={{ color: "var(--steel)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "#ef4444";
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "var(--steel)";
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "transparent";
                            }}
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

        {}
        {totalPages > 1 && (
          <div
            className="d-flex align-items-center justify-content-between px-4 py-3"
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "rgba(242,238,234,.3)",
            }}
          >
            <p
              className="mb-0 text-muted-brand"
              style={{ fontSize: ".875rem" }}
            >
              Showing{" "}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredInventory.length
              )}{" "}
              of {filteredInventory.length}
            </p>
            <div className="d-flex align-items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
