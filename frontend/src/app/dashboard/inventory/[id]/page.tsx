"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Warehouse,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
} from "lucide-react";
import {
  inventoryApi,
  type InventoryResponse,
  type StockUpdateRequest,
  type StockOperation,
} from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inventoryId = Number(params.id);

  const [item, setItem] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showStockForm, setShowStockForm] = useState(false);
  const [stockQty, setStockQty] = useState(0);
  const [stockOp, setStockOp] = useState<StockOperation>("INCREASE");
  const [stockReason, setStockReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getById(inventoryId);
      setItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inventoryId) fetchItem();
  }, [inventoryId]);

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || stockQty <= 0) return;
    setUpdating(true);
    try {
      const req: StockUpdateRequest = {
        quantity: stockQty,
        operation: stockOp,
        reason: stockReason || undefined,
      };
      const updated = await inventoryApi.updateStock(item.inventoryId, req);
      setItem(updated);
      setShowStockForm(false);
      setStockQty(0);
      setStockReason("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Stock update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm("Are you sure you want to delete this inventory record?"))
      return;
    try {
      await inventoryApi.delete(item.inventoryId);
      router.push("/dashboard/inventory");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner message="Loading inventory record..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchItem} />;
  if (!item)
    return <ErrorMessage message="Inventory record not found" />;

  return (
    <div>
      {}
      <Link
        href="/dashboard/inventory"
        className="d-inline-flex align-items-center gap-2 text-decoration-none text-muted-brand mb-3"
        style={{ fontSize: ".875rem" }}
      >
        <ArrowLeft size={16} />
        Back to Inventory
      </Link>

      {}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1
            className="fw-bold text-navy mb-1"
            style={{ fontSize: "1.5rem" }}
          >
            Inventory #{item.inventoryId}
          </h1>
          <div className="d-flex align-items-center gap-2">
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
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => setShowStockForm(!showStockForm)}
            className="btn-amber"
          >
            <Edit size={16} />
            Update Stock
          </button>
          <button
            onClick={handleDelete}
            className="btn-ghost"
            style={{ color: "#ef4444", border: "1px solid #fecaca" }}
          >
            Delete
          </button>
        </div>
      </div>

      {}
      {showStockForm && (
        <div className="card-brand mb-4">
          <div className="p-4">
            <h2
              className="fw-bold text-navy mb-3"
              style={{ fontSize: "1.1rem" }}
            >
              Update Stock
            </h2>
            <form onSubmit={handleStockUpdate}>
              <div className="row g-3">
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand"
                    style={{ fontSize: ".875rem" }}
                  >
                    Operation
                  </label>
                  <select
                    className="input-brand"
                    value={stockOp}
                    onChange={(e) =>
                      setStockOp(e.target.value as StockOperation)
                    }
                  >
                    <option value="INCREASE">Increase</option>
                    <option value="DECREASE">Decrease</option>
                    <option value="SET">Set Exact</option>
                  </select>
                </div>
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand"
                    style={{ fontSize: ".875rem" }}
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="input-brand"
                    min={1}
                    value={stockQty || ""}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label
                    className="form-label text-muted-brand"
                    style={{ fontSize: ".875rem" }}
                  >
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    className="input-brand"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder="e.g. Restocking"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={updating || stockQty <= 0}
                  className="btn-amber"
                >
                  {updating ? "Updating..." : "Apply"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStockForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <div className="row g-4">
        {}
        <div className="col-12 col-lg-6">
          <div className="card-brand h-100">
            <div className="p-4">
              <h2
                className="fw-bold text-navy mb-3"
                style={{ fontSize: "1.1rem" }}
              >
                <Package
                  size={18}
                  style={{ verticalAlign: "-3px", marginRight: 6 }}
                />
                Stock Information
              </h2>
              <div className="d-flex flex-column gap-3">
                <DetailRow label="Product ID" value={`#${item.productId}`} />
                <DetailRow
                  label="Quantity on Hand"
                  value={
                    <span
                      className="fw-bold"
                      style={{
                        color: item.lowStock ? "#ef4444" : "var(--navy)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.quantityOnHand.toLocaleString()}
                    </span>
                  }
                />
                <DetailRow
                  label="Reorder Level"
                  value={item.reorderLevel}
                />
                <DetailRow
                  label="Reorder Quantity"
                  value={item.reorderQuantity}
                />
                <DetailRow
                  label="Low Stock Alert Sent"
                  value={item.lowStockAlertSent ? "Yes" : "No"}
                />
                <DetailRow
                  label="Last Restocked"
                  value={
                    item.lastRestockedAt
                      ? formatDateTime(item.lastRestockedAt)
                      : "Never"
                  }
                />
                <DetailRow
                  label="Last Updated"
                  value={
                    item.updatedAt
                      ? formatDateTime(item.updatedAt)
                      : "—"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="col-12 col-lg-6">
          <div className="card-brand h-100">
            <div className="p-4">
              <h2
                className="fw-bold text-navy mb-3"
                style={{ fontSize: "1.1rem" }}
              >
                <Warehouse
                  size={18}
                  style={{ verticalAlign: "-3px", marginRight: 6 }}
                />
                Warehouse Details
              </h2>
              <div className="d-flex flex-column gap-3">
                <DetailRow
                  label="Warehouse"
                  value={item.warehouse.name}
                />
                <DetailRow
                  label="Address"
                  value={item.warehouse.address || "—"}
                />
                <DetailRow
                  label="City"
                  value={item.warehouse.city || "—"}
                />
                <DetailRow
                  label="Country"
                  value={item.warehouse.country || "—"}
                />
                <DetailRow
                  label="Contact"
                  value={item.warehouse.contactPhone || "—"}
                />
                <DetailRow
                  label="Capacity"
                  value={
                    item.warehouse.capacity
                      ? item.warehouse.capacity.toLocaleString()
                      : "—"
                  }
                />
                <DetailRow
                  label="Status"
                  value={
                    item.warehouse.isActive ? (
                      <span style={{ color: "#16a34a" }}>Active</span>
                    ) : (
                      <span style={{ color: "#ef4444" }}>Inactive</span>
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="d-flex justify-content-between align-items-center py-2"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <span
        className="text-muted-brand"
        style={{ fontSize: ".875rem" }}
      >
        {label}
      </span>
      <span className="text-navy fw-medium" style={{ fontSize: ".875rem" }}>
        {value}
      </span>
    </div>
  );
}
