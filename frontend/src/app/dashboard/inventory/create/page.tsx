"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  inventoryApi,
  warehouseApi,
  type InventoryRequest,
  type WarehouseResponse,
} from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CreateInventoryPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InventoryRequest>({
    productId: 0,
    warehouseId: 0,
    quantityOnHand: 0,
    reorderLevel: 10,
    reorderQuantity: 50,
  });

  useEffect(() => {
    warehouseApi
      .getAll()
      .then(setWarehouses)
      .catch(() => setWarehouses([]))
      .finally(() => setLoadingWarehouses(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await inventoryApi.create(form);
      router.push(`/dashboard/inventory/${created.inventoryId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof InventoryRequest, value: number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Link
        href="/dashboard/inventory"
        className="d-inline-flex align-items-center gap-2 text-decoration-none text-muted-brand mb-3"
        style={{ fontSize: ".875rem" }}
      >
        <ArrowLeft size={16} />
        Back to Inventory
      </Link>

      <h1
        className="fw-bold text-navy mb-4"
        style={{ fontSize: "1.5rem" }}
      >
        Add Inventory Record
      </h1>

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
            {error}
          </p>
        </div>
      )}

      <div className="card-brand">
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label
                  className="form-label text-muted-brand fw-medium"
                  style={{ fontSize: ".875rem" }}
                >
                  Product ID *
                </label>
                <input
                  type="number"
                  className="input-brand"
                  min={1}
                  required
                  value={form.productId || ""}
                  onChange={(e) =>
                    updateField("productId", Number(e.target.value))
                  }
                  placeholder="Enter product ID"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label
                  className="form-label text-muted-brand fw-medium"
                  style={{ fontSize: ".875rem" }}
                >
                  Warehouse *
                </label>
                {loadingWarehouses ? (
                  <div className="input-brand d-flex align-items-center text-muted-brand">
                    Loading warehouses...
                  </div>
                ) : warehouses.length === 0 ? (
                  <div>
                    <input
                      type="number"
                      className="input-brand"
                      min={1}
                      required
                      value={form.warehouseId || ""}
                      onChange={(e) =>
                        updateField("warehouseId", Number(e.target.value))
                      }
                      placeholder="Enter warehouse ID"
                    />
                    <small className="text-muted-brand">
                      No warehouses loaded. Enter ID manually or{" "}
                      <Link href="/dashboard/inventory/warehouses">
                        create a warehouse
                      </Link>{" "}
                      first.
                    </small>
                  </div>
                ) : (
                  <select
                    className="input-brand"
                    required
                    value={form.warehouseId || ""}
                    onChange={(e) =>
                      updateField("warehouseId", Number(e.target.value))
                    }
                  >
                    <option value="">Select warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.warehouseId} value={w.warehouseId}>
                        {w.name}
                        {w.city ? ` (${w.city})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-12 col-sm-4">
                <label
                  className="form-label text-muted-brand fw-medium"
                  style={{ fontSize: ".875rem" }}
                >
                  Quantity on Hand *
                </label>
                <input
                  type="number"
                  className="input-brand"
                  min={0}
                  required
                  value={form.quantityOnHand ?? ""}
                  onChange={(e) =>
                    updateField("quantityOnHand", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-12 col-sm-4">
                <label
                  className="form-label text-muted-brand fw-medium"
                  style={{ fontSize: ".875rem" }}
                >
                  Reorder Level
                </label>
                <input
                  type="number"
                  className="input-brand"
                  min={0}
                  value={form.reorderLevel ?? ""}
                  onChange={(e) =>
                    updateField("reorderLevel", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-12 col-sm-4">
                <label
                  className="form-label text-muted-brand fw-medium"
                  style={{ fontSize: ".875rem" }}
                >
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  className="input-brand"
                  min={1}
                  value={form.reorderQuantity ?? ""}
                  onChange={(e) =>
                    updateField("reorderQuantity", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-amber"
              >
                {submitting ? "Creating..." : "Create Record"}
              </button>
              <Link href="/dashboard/inventory" className="btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
