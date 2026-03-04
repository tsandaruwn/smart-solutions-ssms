'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Category {
  id: number
  name: string
  description?: string
}

interface Product {
  id: number
  sku: string
  name: string
  categoryId: number
  categoryName?: string
  supplierId: number
  price: number
  description: string
  imageUrl?: string
  isActive: boolean
}

const API_BASE = 'http://localhost:8080/api'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    categoryId: '',
    supplierId: '',
    price: '',
    description: '',
    imageUrl: ''
  })
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [showOnlyAvailable])

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`)
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(null)
      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description?.trim() || ''
      }
      await axios.post(`${API_BASE}/categories`, payload)
      setSuccess('Category added!')
      setShowCategoryModal(false)
      setCategoryForm({ name: '', description: '' })
      loadCategories()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add category')
      console.error(err)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = showOnlyAvailable
        ? `${API_BASE}/products/available`
        : `${API_BASE}/products`
      const res = await axios.get(url)
      setProducts(res.data)
    } catch (err: any) {
      setError('Failed to load products. Check if backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(null)

      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
        supplierId: Number(formData.supplierId),
        price: parseFloat(formData.price),
        description: formData.description?.trim() || '',
        imageUrl: formData.imageUrl?.trim() || ''
      }

      if (editingProduct) {
        await axios.put(`${API_BASE}/products/${editingProduct.id}`, payload)
        setSuccess('Product updated!')
      } else {
        await axios.post(`${API_BASE}/products`, payload)
        setSuccess('Product added!')
      }

      setShowModal(false)
      resetForm()
      loadProducts()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product')
      console.error(err)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      sku: product.sku,
      name: product.name,
      categoryId: String(product.categoryId),
      supplierId: String(product.supplierId),
      price: product.price.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) {
      return
    }

    try {
      setError(null)
      await axios.delete(`${API_BASE}/products/${id}`)
      setSuccess('Product deleted!')
      loadProducts()
    } catch (err: any) {
      setError('Failed to delete')
      console.error(err)
    }
  }

  const handleDiscontinue = async (id: number) => {
    try {
      setError(null)
      await axios.patch(`${API_BASE}/products/${id}/discontinue`)
      setSuccess('Product discontinued!')
      loadProducts()
    } catch (err: any) {
      setError('Failed to discontinue')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      categoryId: '',
      supplierId: '',
      price: '',
      description: '',
      imageUrl: ''
    })
    setEditingProduct(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Smart Home Product Management</h1>
        <p>Manage your smart home product catalog</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="actions-bar">
        <button className="button button-primary" onClick={openAddModal}>
          <span>+</span> Add New Product
        </button>
        <button className="button button-secondary" onClick={() => setShowCategoryModal(true)}>
          + Add Category
        </button>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
          />
          <span>Show only available products</span>
        </label>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="loading">No products found. Add your first product!</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${!product.isActive ? 'discontinued' : ''}`}
            >
              <h3>{product.name}</h3>
              <span className="category">{product.categoryName || 'Category'}</span>
              <div className="price">${product.price.toFixed(2)}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>
                <div>SKU: {product.sku}</div>
                <div>Supplier ID: {product.supplierId}</div>
              </div>
              {product.imageUrl && (
                <div style={{ marginBottom: '12px' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                </div>
              )}
              {product.description && (
                <p className="description">{product.description}</p>
              )}
              <div className="actions">
                <button
                  className="button button-secondary"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                {product.isActive && (
                  <button
                    className="button button-danger"
                    onClick={() => handleDiscontinue(product.id)}
                  >
                    ⏸️ Discontinue
                  </button>
                )}
                <button
                  className="button button-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  maxLength={60}
                />
              </div>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={150}
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Supplier ID *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  maxLength={255}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                <button type="button" className="button button-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  {editingProduct ? '✓ Update' : '+ Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Category</h2>
              <button className="close-button" onClick={() => setShowCategoryModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={createCategory}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                <button type="button" className="button button-secondary" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  + Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
