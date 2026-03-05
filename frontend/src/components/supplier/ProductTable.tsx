// ====================================
// PRODUCT TABLE COMPONENT
// Purpose: Display products in a table with action buttons
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// Features: Edit, Delete, Stock indicators, Price formatting
// ====================================

import { Edit, Trash2, Package, DollarSign, Building2, AlertTriangle } from "lucide-react";
import type { Product } from "@/types/supplier";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  showSupplier?: boolean; // Whether to show supplier column
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  showSupplier = true,
}: ProductTableProps) {
  /**
   * Format price with currency symbol
   * @param price - Price value
   * @returns Formatted price string
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  /**
   * Get stock status based on quantity
   * @param quantity - Quantity in stock
   * @returns Status object with color and label
   */
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", color: "#ef4444", bgColor: "rgba(239,68,68,0.1)" };
    } else if (quantity < 10) {
      return { label: "Low Stock", color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)" };
    } else if (quantity < 50) {
      return { label: "In Stock", color: "#eab308", bgColor: "rgba(234,179,8,0.1)" };
    } else {
      return { label: "Well Stocked", color: "#22c55e", bgColor: "rgba(34,197,94,0.1)" };
    }
  };

  /**
   * Format date string to readable format
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Empty state when no products found
  if (products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Package size={48} style={{ color: "var(--steel)", opacity: 0.5 }} />
        <p style={styles.emptyText}>No products found</p>
        <p style={styles.emptySubtext}>Add products to get started</p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product Name</th>
              {showSupplier && <th style={styles.th}>Supplier</th>}
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Unit Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.quantityInStock);

              return (
                <tr key={product.productId} style={styles.row}>
                  {/* Product ID */}
                  <td style={styles.td}>
                    <span style={styles.idBadge}>{product.productId}</span>
                  </td>

                  {/* Product Name */}
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <Package size={16} style={{ color: "var(--amber)" }} />
                      <strong style={styles.productName}>{product.productName}</strong>
                    </div>
                  </td>

                  {/* Supplier (if showSupplier is true) */}
                  {showSupplier && (
                    <td style={styles.td}>
                      {product.supplierName ? (
                        <div style={styles.supplierCell}>
                          <Building2 size={14} style={{ color: "var(--steel)" }} />
                          {product.supplierName}
                        </div>
                      ) : (
                        <span style={styles.noData}>-</span>
                      )}
                    </td>
                  )}

                  {/* Description */}
                  <td style={styles.td}>
                    {product.description ? (
                      <span
                        style={styles.description}
                        title={product.description}
                      >
                        {product.description.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description}
                      </span>
                    ) : (
                      <span style={styles.noData}>-</span>
                    )}
                  </td>

                  {/* Unit Price */}
                  <td style={styles.td}>
                    <div style={styles.priceCell}>
                      <DollarSign size={14} style={{ color: "var(--amber)" }} />
                      <strong style={styles.price}>
                        {formatPrice(product.unitPrice)}
                      </strong>
                    </div>
                  </td>

                  {/* Quantity in Stock */}
                  <td style={styles.td}>
                    <div style={styles.stockCell}>
                      <span style={styles.stockQuantity}>
                        {product.quantityInStock.toLocaleString()}
                      </span>
                      {product.quantityInStock < 10 && (
                        <AlertTriangle
                          size={14}
                          style={{ color: stockStatus.color }}
                        />
                      )}
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        color: stockStatus.color,
                        backgroundColor: stockStatus.bgColor,
                      }}
                    >
                      {stockStatus.label}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td style={styles.td}>
                    <span style={styles.date}>{formatDate(product.createdAt)}</span>
                  </td>

                  {/* Action Buttons */}
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(product)}
                        style={styles.editButton}
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(product.productId)}
                        style={styles.deleteButton}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ====================================
// STYLES
// Uses brand color palette
// ====================================
const styles = {
  // Container
  tableContainer: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(26,50,99,0.08)",
  } as React.CSSProperties,

  tableWrapper: {
    overflowX: "auto" as const,
  } as React.CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: "1000px",
  } as React.CSSProperties,

  // Header
  headerRow: {
    backgroundColor: "var(--navy)",
    color: "white",
  } as React.CSSProperties,

  th: {
    padding: "16px 12px",
    textAlign: "left" as const,
    fontWeight: 600,
    fontSize: "13px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  // Body
  row: {
    borderBottom: "1px solid var(--border-color)",
    transition: "background-color 0.15s ease",
  } as React.CSSProperties,

  td: {
    padding: "14px 12px",
    fontSize: "14px",
    color: "var(--navy)",
    verticalAlign: "middle" as const,
  } as React.CSSProperties,

  // ID Badge
  idBadge: {
    display: "inline-block",
    padding: "4px 10px",
    backgroundColor: "var(--cream)",
    color: "var(--navy)",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
  } as React.CSSProperties,

  // Product Cell
  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,

  productName: {
    color: "var(--navy)",
    fontSize: "14px",
    fontWeight: 600,
  } as React.CSSProperties,

  // Supplier Cell
  supplierCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--steel)",
  } as React.CSSProperties,

  // Description
  description: {
    fontSize: "13px",
    color: "var(--steel)",
    lineHeight: "1.4",
  } as React.CSSProperties,

  // Price Cell
  priceCell: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  } as React.CSSProperties,

  price: {
    color: "var(--navy)",
    fontSize: "14px",
    fontWeight: 600,
  } as React.CSSProperties,

  // Stock Cell
  stockCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,

  stockQuantity: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--navy)",
  } as React.CSSProperties,

  // Status Badge
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  // Date
  date: {
    fontSize: "13px",
    color: "var(--steel)",
  } as React.CSSProperties,

  // Actions
  actions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  } as React.CSSProperties,

  editButton: {
    padding: "8px",
    backgroundColor: "var(--amber)",
    color: "var(--navy)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  deleteButton: {
    padding: "8px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  // Empty State
  emptyState: {
    textAlign: "center" as const,
    padding: "60px 20px",
    color: "var(--steel)",
  } as React.CSSProperties,

  emptyText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--navy)",
    marginTop: "16px",
    marginBottom: "4px",
  } as React.CSSProperties,

  emptySubtext: {
    fontSize: "14px",
    color: "var(--steel)",
  } as React.CSSProperties,

  noData: {
    color: "var(--steel)",
    opacity: 0.5,
  } as React.CSSProperties,
};
