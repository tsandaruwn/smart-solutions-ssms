'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import '../globals.css'

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  discontinued: boolean
}

const API_URL = 'http://localhost:8080/api/products'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    loadProducts()
  }, [showOnlyAvailable])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = showOnlyAvailable ? `${API_URL}/available` : API_URL
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

      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct.id}`, {
          ...formData,
          price: parseFloat(formData.price),
          discontinued: editingProduct.discontinued
        })
        setSuccess('Product updated!')
      } else {
        await axios.post(API_URL, {
          ...formData,
          price: parseFloat(formData.price)
        })
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
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) {
      return
    }

    try {
      setError(null)
      await axios.delete(`${API_URL}/${id}`)
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
      await axios.patch(`${API_URL}/${id}/discontinue`)
      setSuccess('Product discontinued!')
      loadProducts()
    } catch (err: any) {
      setError('Failed to discontinue')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: ''
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
              className={`product-card ${product.discontinued ? 'discontinued' : ''}`}
            >
              <h3>{product.name}</h3>
              <span className="category">{product.category}</span>
              <div className="price">${product.price.toFixed(2)}</div>
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
                {!product.discontinued && (
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
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Smart Lighting">Smart Lighting</option>
                  <option value="Smart Security">Smart Security</option>
                  <option value="Smart Thermostat">Smart Thermostat</option>
                  <option value="Smart Speaker">Smart Speaker</option>
                  <option value="Smart Camera">Smart Camera</option>
                  <option value="Smart Lock">Smart Lock</option>
                  <option value="Smart Sensor">Smart Sensor</option>
                  <option value="Other">Other</option>
                </select>
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
    </div>
  )
}
