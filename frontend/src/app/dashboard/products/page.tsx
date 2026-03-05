"use client";

import { useEffect, useMemo, useState } from "react";
import {
  categoryApi,
  productApi,
  supplierApi,
  type ProductCategory,
  type ProductRequest,
  type ProductResponse,
  type SupplierResponse,
} from "@/lib/api";
import { Edit, Plus, Save, Trash2, Ban, Package } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const emptyProductForm = {
  sku: "",
  name: "",
  categoryId: "",
  supplierId: "",
  price: "",
  description: "",
  imageUrl: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        showOnlyActive ? productApi.getAvailable() : productApi.getAll(),
        categoryApi.getAll(),
        supplierApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showOnlyActive]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [products]);

  const clearProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingId(null);
  };

  const buildProductPayload = (): ProductRequest => {
    return {
      sku: productForm.sku.trim(),
      name: productForm.name.trim(),
      categoryId: Number(productForm.categoryId),
      supplierId: Number(productForm.supplierId),
      price: Number(productForm.price),
      description: productForm.description.trim(),
      imageUrl: productForm.imageUrl.trim(),
    };
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = buildProductPayload();
      if (editingId) {
        await productApi.update(editingId, payload);
        setSuccess("Product updated");
      } else {
        await productApi.create(payload);
        setSuccess("Product created");
      }
      clearProductForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const startEdit = (product: ProductResponse) => {
    setEditingId(product.id);
    setProductForm({
      sku: product.sku || "",
      name: product.name || "",
      categoryId: String(product.categoryId || ""),
      supplierId: String(product.supplierId || ""),
      price: String(product.price || ""),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await categoryApi.create({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
      });
      setCategoryForm({ name: "", description: "" });
      setSuccess("Category created");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    }
  };

  const handleDiscontinue = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await productApi.discontinue(id);
      setSuccess("Product discontinued");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to discontinue product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    setError(null);
    setSuccess(null);
    try {
      await productApi.delete(id);
      setSuccess("Product deleted");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Product Management
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            Manage smart home products and categories
          </p>
        </div>
        <button className="btn-amber" onClick={clearProductForm}>
          <Plus size={16} />
          New Product
        </button>
      </div>

      {error && (
        <div className="warning-banner mb-3">
          <span className="mb-0 text-amber-dark">{error}</span>
        </div>
      )}
      {success && (
        <div className="warning-banner mb-3" style={{ background: "#e8f7ea", borderColor: "#b8e4bf" }}>
          <span className="mb-0" style={{ color: "#166534" }}>{success}</span>
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="card-brand">
            <div className="card-brand-header">
              <span className="fw-semibold text-navy" style={{ fontSize: ".9375rem" }}>
                {editingId ? "Edit Product" : "Add Product"}
              </span>
            </div>
            <div className="card-brand-body">
              <form onSubmit={handleSaveProduct} className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label">SKU</label>
                  <input className="input-brand" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} required />
                </div>
                <div className="col-12 col-md-8">
                  <label className="form-label">Product Name</label>
                  <input className="input-brand" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Category</label>
                  <select className="input-brand" value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Supplier</label>
                  <select className="input-brand" value={productForm.supplierId} onChange={(e) => setProductForm({ ...productForm, supplierId: e.target.value })} required>
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.supplierId} value={s.supplierId}>
                        {s.companyName} ({s.contactPerson})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Price</label>
                  <input type="number" step="0.01" className="input-brand" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input className="input-brand" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="input-brand" rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <div className="col-12 d-flex gap-2 justify-content-end">
                  <button type="button" className="btn-ghost" onClick={clearProductForm}>Clear</button>
                  <button type="submit" className="btn-amber">
                    <Save size={15} />
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card-brand">
            <div className="card-brand-header">
              <span className="fw-semibold text-navy" style={{ fontSize: ".9375rem" }}>
                Add Category
              </span>
            </div>
            <div className="card-brand-body">
              <form onSubmit={handleCreateCategory} className="d-flex flex-column gap-3">
                <input className="input-brand" placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                <textarea className="input-brand" rows={3} placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                <button className="btn-amber" type="submit">
                  <Plus size={15} />
                  Add Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card-brand">
        <div className="card-brand-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold text-navy" style={{ fontSize: ".9375rem" }}>
            Products ({sortedProducts.length})
          </span>
          <div className="d-flex align-items-center gap-2">
            <input id="activeOnly" type="checkbox" checked={showOnlyActive} onChange={(e) => setShowOnlyActive(e.target.checked)} />
            <label htmlFor="activeOnly" className="text-muted-brand mb-0" style={{ fontSize: ".85rem" }}>
              Active only
            </label>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <Package size={42} className="text-cream-dark" />
            <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem" }}>
              No products found
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th className="text-end">Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.categoryName || p.categoryId}</td>
                    <td>{p.supplierId}</td>
                    <td className="text-end">LKR {Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.isActive ? "text-bg-success" : "text-bg-secondary"}`}>
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button className="btn-icon" title="Edit" onClick={() => startEdit(p)}>
                          <Edit size={15} />
                        </button>
                        {p.isActive && (
                          <button className="btn-icon" title="Discontinue" onClick={() => handleDiscontinue(p.id)}>
                            <Ban size={15} />
                          </button>
                        )}
                        <button className="btn-icon" title="Delete" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

