// ====================================
// SUPPLIER DETAIL PAGE
// Purpose: Display detailed information about a specific supplier and their products
// Route: /dashboard/suppliers/[id]
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// ====================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Edit,
  CheckCircle,
  XCircle,
  User,
  Plus,
} from "lucide-react";
import ProductTable from "@/components/supplier/ProductTable";
import SupplierModal from "@/components/supplier/SupplierModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatusBadge from "@/components/ui/StatusBadge";
import { supplierAPI } from "@/lib/supplierApi";
import type {
  Supplier,
  Product,
  UpdateSupplierRequest,
} from "@/types/supplier";

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = Number(params.id);

  // State management
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /**
   * Load supplier details and products
   */
  const loadSupplierDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load supplier details
      const supplierData = await supplierAPI.getSupplierById(supplierId);
      setSupplier(supplierData);

      // Load supplier's products
      const productsData = await supplierAPI.getSupplierProducts(supplierId);
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || "Failed to load supplier details");
      console.error("Error loading supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize page - load supplier details
   */
  useEffect(() => {
    if (supplierId) {
      loadSupplierDetails();
    }
  }, [supplierId]);

  /**
   * Handle update supplier
   */
  const handleUpdateSupplier = async (
    supplierData: UpdateSupplierRequest
  ) => {
    try {
      await supplierAPI.updateSupplier(supplierId, supplierData);
      await loadSupplierDetails();
      setIsEditModalOpen(false);
    } catch (err: any) {
      throw err; // Re-throw to be handled by modal
    }
  };

  /**
   * Handle toggle supplier status
   */
  const handleToggleStatus = async () => {
    if (!supplier) return;

    try {
      if (supplier.isActive) {
        await supplierAPI.deactivateSupplier(supplierId);
      } else {
        await supplierAPI.activateSupplier(supplierId);
      }
      await loadSupplierDetails();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  /**
   * Handle delete product (placeholder - implement product deletion)
   */
  const handleDeleteProduct = async (productId: number) => {
    const product = products.find((p) => p.productId === productId);
    if (
      !confirm(
        `Are you sure you want to delete "${product?.productName}"?`
      )
    ) {
      return;
    }

    try {
      await supplierAPI.deleteProduct(productId);
      await loadSupplierDetails();
    } catch (err: any) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  /**
   * Handle edit product (placeholder - navigate to edit page)
   */
  const handleEditProduct = (product: Product) => {
    // Navigate to product edit page or open modal
    alert(`Edit product feature coming soon for: ${product.productName}`);
  };

  /**
   * Format date string to readable format
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Get contract status
   */
  const getContractStatus = () => {
    if (!supplier?.contractStartDate && !supplier?.contractEndDate) {
      return { label: "No Contract", color: "var(--steel)" };
    }

    const today = new Date();
    const start = supplier?.contractStartDate
      ? new Date(supplier.contractStartDate)
      : null;
    const end = supplier?.contractEndDate
      ? new Date(supplier.contractEndDate)
      : null;

    if (end && end < today) {
      return { label: "Expired", color: "#ef4444" };
    }
    if (start && start > today) {
      return { label: "Upcoming", color: "#3b82f6" };
    }
    return { label: "Active Contract", color: "#22c55e" };
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error || !supplier) {
    return (
      <div style={styles.container}>
        <button onClick={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back
        </button>
        <ErrorMessage message={error || "Supplier not found"} />
      </div>
    );
  }

  const contractStatus = getContractStatus();

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Suppliers
      </button>

      {/* Supplier Header Card */}
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <Building2 size={36} style={{ color: "var(--amber)" }} />
            </div>
            <div>
              <h1 style={styles.companyName}>{supplier.companyName}</h1>
              <div style={styles.headerMeta}>
                <span style={styles.supplierId}>ID: {supplier.supplierId}</span>
                <span style={styles.separator}>•</span>
                <span style={styles.createdDate}>
                  Created: {formatDate(supplier.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={handleToggleStatus}
              style={{
                ...styles.statusButton,
                ...(supplier.isActive
                  ? styles.statusButtonActive
                  : styles.statusButtonInactive),
              }}
            >
              {supplier.isActive ? (
                <>
                  <CheckCircle size={18} />
                  Active
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Inactive
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              style={styles.editButton}
            >
              <Edit size={18} />
              Edit Supplier
            </button>
          </div>
        </div>

        {/* Supplier Information Grid */}
        <div style={styles.infoGrid}>
          {/* Contact Person */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <User size={16} />
              Contact Person
            </div>
            <div style={styles.infoValue}>{supplier.contactPerson}</div>
          </div>

          {/* Email */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <Mail size={16} />
              Email
            </div>
            <a href={`mailto:${supplier.email}`} style={styles.infoLink}>
              {supplier.email}
            </a>
          </div>

          {/* Phone */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <Phone size={16} />
              Phone
            </div>
            <div style={styles.infoValue}>
              {supplier.phone ? (
                <a href={`tel:${supplier.phone}`} style={styles.infoLink}>
                  {supplier.phone}
                </a>
              ) : (
                <span style={styles.noData}>Not provided</span>
              )}
            </div>
          </div>

          {/* Location */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <MapPin size={16} />
              Location
            </div>
            <div style={styles.infoValue}>
              {supplier.city || supplier.country ? (
                <>
                  {supplier.city && <div>{supplier.city}</div>}
                  {supplier.country && (
                    <div style={styles.countryText}>{supplier.country}</div>
                  )}
                </>
              ) : (
                <span style={styles.noData}>Not provided</span>
              )}
            </div>
          </div>

          {/* Address */}
          {supplier.address && (
            <div style={{ ...styles.infoItem, gridColumn: "1 / -1" }}>
              <div style={styles.infoLabel}>
                <MapPin size={16} />
                Address
              </div>
              <div style={styles.infoValue}>{supplier.address}</div>
            </div>
          )}

          {/* Contract Period */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <Calendar size={16} />
              Contract Period
            </div>
            <div style={styles.contractInfo}>
              <StatusBadge
                status={contractStatus.label}
                color={contractStatus.color}
              />
              {(supplier.contractStartDate || supplier.contractEndDate) && (
                <div style={styles.contractDates}>
                  {supplier.contractStartDate && (
                    <div>Start: {formatDate(supplier.contractStartDate)}</div>
                  )}
                  {supplier.contractEndDate && (
                    <div>End: {formatDate(supplier.contractEndDate)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={styles.productsSection}>
        <div style={styles.productsSectionHeader}>
          <div style={styles.productsSectionLeft}>
            <Package size={24} style={{ color: "var(--amber)" }} />
            <h2 style={styles.productsSectionTitle}>
              Products ({products.length})
            </h2>
          </div>
          <button style={styles.addProductButton}>
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {products.length > 0 ? (
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            showSupplier={false}
          />
        ) : (
          <div style={styles.noProducts}>
            <Package size={48} style={{ color: "var(--steel)", opacity: 0.3 }} />
            <p style={styles.noProductsText}>No products yet</p>
            <p style={styles.noProductsSubtext}>
              Add products to this supplier to get started
            </p>
          </div>
        )}
      </div>

      {/* Edit Supplier Modal */}
      <SupplierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateSupplier}
        supplier={supplier}
        title="Edit Supplier"
      />
    </div>
  );
}

// ====================================
// STYLES
// Uses brand color palette
// ====================================
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  } as React.CSSProperties,

  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  } as React.CSSProperties,

  // Back Button
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "var(--cream)",
    color: "var(--navy)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    width: "fit-content",
  } as React.CSSProperties,

  // Header Card
  headerCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(26,50,99,0.08)",
  } as React.CSSProperties,

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap" as const,
    gap: "16px",
  } as React.CSSProperties,

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  } as React.CSSProperties,

  iconWrapper: {
    width: "80px",
    height: "80px",
    backgroundColor: "rgba(250,185,91,0.15)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  companyName: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
    color: "var(--navy)",
  } as React.CSSProperties,

  headerMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    fontSize: "14px",
    color: "var(--steel)",
  } as React.CSSProperties,

  supplierId: {
    fontWeight: 600,
    color: "var(--steel)",
  } as React.CSSProperties,

  separator: {
    color: "var(--steel)",
  } as React.CSSProperties,

  createdDate: {
    color: "var(--steel)",
  } as React.CSSProperties,

  headerActions: {
    display: "flex",
    gap: "12px",
  } as React.CSSProperties,

  statusButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,

  statusButtonActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
    color: "#16a34a",
  } as React.CSSProperties,

  statusButtonInactive: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#dc2626",
  } as React.CSSProperties,

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "var(--amber)",
    color: "var(--navy)",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,

  // Info Grid
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  } as React.CSSProperties,

  infoItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  } as React.CSSProperties,

  infoLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--steel)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,

  infoValue: {
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--navy)",
  } as React.CSSProperties,

  infoLink: {
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--steel)",
    textDecoration: "none",
    transition: "color 0.2s",
  } as React.CSSProperties,

  countryText: {
    fontSize: "13px",
    color: "var(--steel)",
    marginTop: "2px",
  } as React.CSSProperties,

  noData: {
    color: "var(--steel)",
    opacity: 0.5,
    fontStyle: "italic" as const,
  } as React.CSSProperties,

  contractInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  } as React.CSSProperties,

  contractDates: {
    fontSize: "13px",
    color: "var(--steel)",
  } as React.CSSProperties,

  // Products Section
  productsSection: {
    backgroundColor: "var(--surface)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(26,50,99,0.08)",
  } as React.CSSProperties,

  productsSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  } as React.CSSProperties,

  productsSectionLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,

  productsSectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--navy)",
  } as React.CSSProperties,

  addProductButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "var(--amber)",
    color: "var(--navy)",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,

  noProducts: {
    textAlign: "center" as const,
    padding: "60px 20px",
  } as React.CSSProperties,

  noProductsText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--navy)",
    marginTop: "16px",
    marginBottom: "4px",
  } as React.CSSProperties,

  noProductsSubtext: {
    fontSize: "14px",
    color: "var(--steel)",
  } as React.CSSProperties,
};
