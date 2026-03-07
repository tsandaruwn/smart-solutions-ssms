"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ShoppingCart, MapPin, User, FileText, Package } from "lucide-react";
import { orderApi, customerApi, productApi, type OrderItemRequest, type CustomerResponse, type ProductResponse } from "@/lib/api";
import { userApi } from "@/lib/userApi";
import type { User as UserType } from "@/types/user";

interface OrderItemForm {
  productId: string;
  quantity: string;
  unitPriceAtOrder: string;
  discountPercent: string;
}

const emptyItem: OrderItemForm = { productId: "", quantity: "1", unitPriceAtOrder: "", discountPercent: "0" };

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [createdByUserId, setCreatedByUserId] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItemForm[]>([{ ...emptyItem }]);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    customerApi.getAll(0, 1000).then((res) => setCustomers(res.content)).catch(() => {});
    userApi.getAllUsers().then(setUsers).catch(() => {});
    productApi.getAvailable().then(setProducts).catch(() => {});
  }, []);

  const addItem    = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const updateItem = (index: number, field: keyof OrderItemForm, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  const updateItemFields = (index: number, fields: Partial<OrderItemForm>) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, ...fields } : item));
  };
  const calcLineTotal = (item: OrderItemForm) =>
    (Number(item.quantity) || 0) * (Number(item.unitPriceAtOrder) || 0) * (1 - (Number(item.discountPercent) || 0) / 100);
  const totalAmount = items.reduce((sum, item) => sum + calcLineTotal(item), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderItems: OrderItemRequest[] = items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPriceAtOrder: Number(item.unitPriceAtOrder),
        discountPercent: Number(item.discountPercent) || undefined,
      }));
      await orderApi.create({
        customerId: Number(customerId),
        createdByUserId: createdByUserId ? Number(createdByUserId) : undefined,
        shippingAddress,
        shippingCity,
        notes: notes || undefined,
        items: orderItems,
      });
      router.push("/dashboard/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <Link href="/dashboard/orders" className="back-link mb-3 d-inline-flex">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="mb-4">
        <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>Create New Order</h1>
        <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>Fill in the details below to place a new order</p>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4" style={{ fontSize: ".875rem" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        {}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
              <User size={16} className="text-steel" /> Customer Information
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Customer <span className="text-danger">*</span>
                </label>
                <select required value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)} className="input-brand">
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.firstName} {c.lastName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Created By (User)
                </label>
                <select value={createdByUserId}
                  onChange={(e) => setCreatedByUserId(e.target.value)} className="input-brand">
                  <option value="">Select user (optional)</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.firstName} {u.lastName} ({u.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
              <MapPin size={16} className="text-steel" /> Shipping Information
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Shipping Address <span className="text-danger">*</span>
                </label>
                <input type="text" required placeholder="Enter full shipping address" value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)} className="input-brand" />
              </div>
              <div className="col-12 col-sm-6">
                <label className="d-block fw-medium text-navy mb-1" style={{ fontSize: ".875rem" }}>
                  Shipping City <span className="text-danger">*</span>
                </label>
                <input type="text" required placeholder="Enter city" value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)} className="input-brand" />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
              <Package size={16} className="text-steel" /> Order Items
            </h2>
            <button type="button" onClick={addItem} className="btn-navy" style={{ padding: "6px 14px", fontSize: ".8125rem", borderRadius: 8 }}>
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="card-brand-body">
            <div className="d-flex flex-column gap-3">
              {items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-sm-3">
                      <label className="d-block fw-medium text-muted-brand mb-1" style={{ fontSize: ".75rem" }}>
                        Product <span className="text-danger">*</span>
                      </label>
                      <select required value={item.productId}
                        onChange={(e) => {
                          const val = e.target.value;
                          const prod = products.find((p) => String(p.id) === val);
                          updateItemFields(index, {
                            productId: val,
                            ...(prod ? { unitPriceAtOrder: String(prod.price) } : {}),
                          });
                        }} className="input-sm">
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4 col-sm-2">
                      <label className="d-block fw-medium text-muted-brand mb-1" style={{ fontSize: ".75rem" }}>
                        Qty <span className="text-danger">*</span>
                      </label>
                      <input type="number" required min="1" placeholder="Qty" value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)} className="input-sm" />
                    </div>
                    <div className="col-8 col-sm-3">
                      <label className="d-block fw-medium text-muted-brand mb-1" style={{ fontSize: ".75rem" }}>
                        Unit Price <span className="text-danger">*</span>
                      </label>
                      <input type="number" required min="0.01" step="0.01" placeholder="0.00" value={item.unitPriceAtOrder}
                        onChange={(e) => updateItem(index, "unitPriceAtOrder", e.target.value)} className="input-sm" />
                    </div>
                    <div className="col-6 col-sm-2">
                      <label className="d-block fw-medium text-muted-brand mb-1" style={{ fontSize: ".75rem" }}>Discount %</label>
                      <input type="number" min="0" max="100" step="0.01" placeholder="0" value={item.discountPercent}
                        onChange={(e) => updateItem(index, "discountPercent", e.target.value)} className="input-sm" />
                    </div>
                    <div className="col-6 col-sm-2 d-flex align-items-center justify-content-between">
                      <span className="d-none d-sm-block fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(calcLineTotal(item))}
                      </span>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="btn-icon ms-auto" style={{ color: "#f87171" }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 mt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
              <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>Estimated Total</span>
              <span className="fw-bold text-navy" style={{ fontSize: "1.25rem" }}>
                {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2 className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2" style={{ fontSize: ".9375rem" }}>
              <FileText size={16} className="text-steel" /> Additional Notes
            </h2>
          </div>
          <div className="card-brand-body">
            <textarea placeholder="Any special instructions or notes..." value={notes}
              onChange={(e) => setNotes(e.target.value)} rows={3} className="textarea-brand" />
          </div>
        </div>

        {}
        <div className="d-flex align-items-center justify-content-end gap-3">
          <Link href="/dashboard/orders" className="btn-ghost">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-amber">
            <ShoppingCart size={16} />
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
