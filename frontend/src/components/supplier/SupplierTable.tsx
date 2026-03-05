// ====================================
// SUPPLIER TABLE COMPONENT
// Purpose: Display suppliers in a table with action buttons
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// Features: Edit, Delete, Activate/Deactivate, View Products
// ====================================

import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  Eye,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import type { Supplier } from "@/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void;
  onToggleStatus: (supplierId: number, currentStatus: boolean) => void;
  onViewDetails: (supplierId: number) => void;
}

export default function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: SupplierTableProps) {
  /**
   * Format date string to readable format
   * @param dateString - ISO date string
   * @returns Formatted date string or dash if empty
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Format contract status based on dates
   * @param startDate - Contract start date
   * @param endDate - Contract end date
   * @returns Status string (Active, Expired, Upcoming, or N/A)
   */
  const getContractStatus = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return "N/A";
    const today = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end && end < today) return "Expired";
    if (start && start > today) return "Upcoming";
    return "Active";
  };

  // Empty state when no suppliers found
  if (suppliers.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Package size={48} style={{ color: "var(--steel)", opacity: 0.5 }} />
        <p style={styles.emptyText}>No suppliers found</p>
        <p style={styles.emptySubtext}>
          Add your first supplier to get started
        </p>
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
              <th style={styles.th}>Company Name</th>
              <th style={styles.th}>Contact Person</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Contract</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => {
              const contractStatus = getContractStatus(
                supplier.contractStartDate,
                supplier.contractEndDate
              );

              return (
                <tr key={supplier.supplierId} style={styles.row}>
                  {/* Supplier ID */}
                  <td style={styles.td}>
                    <span style={styles.idBadge}>{supplier.supplierId}</span>
                  </td>

                  {/* Company Name */}
                  <td style={styles.td}>
                    <div style={styles.companyCell}>
                      <strong style={styles.companyName}>
                        {supplier.companyName}
                      </strong>
                      {supplier.products && supplier.products.length > 0 && (
                        <span style={styles.productCount}>
                          <Package size={12} />
                          {supplier.products.length} products
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td style={styles.td}>
                    <div style={styles.contactCell}>
                      <User size={14} style={{ color: "var(--steel)" }} />
                      {supplier.contactPerson}
                    </div>
                  </td>

                  {/* Email */}
                  <td style={styles.td}>
                    <div style={styles.contactCell}>
                      <Mail size={14} style={{ color: "var(--steel)" }} />
                      <a href={`mailto:${supplier.email}`} style={styles.link}>
                        {supplier.email}
                      </a>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={styles.td}>
                    {supplier.phone ? (
                      <div style={styles.contactCell}>
                        <Phone size={14} style={{ color: "var(--steel)" }} />
                        <a href={`tel:${supplier.phone}`} style={styles.link}>
                          {supplier.phone}
                        </a>
                      </div>
                    ) : (
                      <span style={styles.noData}>-</span>
                    )}
                  </td>

                  {/* Location */}
                  <td style={styles.td}>
                    {supplier.city || supplier.country ? (
                      <div style={styles.locationCell}>
                        <MapPin size={14} style={{ color: "var(--steel)" }} />
                        <div>
                          {supplier.city && (
                            <div style={styles.locationPrimary}>
                              {supplier.city}
                            </div>
                          )}
                          {supplier.country && (
                            <div style={styles.locationSecondary}>
                              {supplier.country}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span style={styles.noData}>-</span>
                    )}
                  </td>

                  {/* Contract Status */}
                  <td style={styles.td}>
                    <div style={styles.contractCell}>
                      <span
                        style={{
                          ...styles.contractBadge,
                          ...(contractStatus === "Active" &&
                            styles.contractActive),
                          ...(contractStatus === "Expired" &&
                            styles.contractExpired),
                          ...(contractStatus === "Upcoming" &&
                            styles.contractUpcoming),
                          ...(contractStatus === "N/A" && styles.contractNA),
                        }}
                      >
                        {contractStatus}
                      </span>
                      {supplier.contractEndDate && (
                        <div style={styles.contractDate}>
                          Until {formatDate(supplier.contractEndDate)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Active Status */}
                  <td style={styles.td}>
                    <button
                      onClick={() =>
                        onToggleStatus(supplier.supplierId, supplier.isActive)
                      }
                      style={{
                        ...styles.statusBadge,
                        ...(supplier.isActive
                          ? styles.statusActive
                          : styles.statusInactive),
                      }}
                      title={
                        supplier.isActive
                          ? "Click to deactivate"
                          : "Click to activate"
                      }
                    >
                      {supplier.isActive ? (
                        <>
                          <CheckCircle size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {/* View Details Button */}
                      <button
                        onClick={() => onViewDetails(supplier.supplierId)}
                        style={styles.viewButton}
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(supplier)}
                        style={styles.editButton}
                        title="Edit supplier"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(supplier.supplierId)}
                        style={styles.deleteButton}
                        title="Delete supplier"
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
    minWidth: "1200px",
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
    cursor: "default",
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

  // Company Cell
  companyCell: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  } as React.CSSProperties,

  companyName: {
    color: "var(--navy)",
    fontSize: "14px",
    fontWeight: 600,
  } as React.CSSProperties,

  productCount: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "var(--steel)",
    fontWeight: 500,
  } as React.CSSProperties,

  // Contact Cell
  contactCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,

  link: {
    color: "var(--steel)",
    textDecoration: "none",
    transition: "color 0.2s",
  } as React.CSSProperties,

  // Location Cell
  locationCell: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
  } as React.CSSProperties,

  locationPrimary: {
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--navy)",
  } as React.CSSProperties,

  locationSecondary: {
    fontSize: "11px",
    color: "var(--steel)",
  } as React.CSSProperties,

  // Contract Cell
  contractCell: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  } as React.CSSProperties,

  contractBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
    width: "fit-content",
  } as React.CSSProperties,

  contractActive: {
    backgroundColor: "rgba(34,197,94,0.1)",
    color: "#16a34a",
  } as React.CSSProperties,

  contractExpired: {
    backgroundColor: "rgba(239,68,68,0.1)",
    color: "#dc2626",
  } as React.CSSProperties,

  contractUpcoming: {
    backgroundColor: "rgba(59,130,246,0.1)",
    color: "#2563eb",
  } as React.CSSProperties,

  contractNA: {
    backgroundColor: "var(--cream)",
    color: "var(--steel)",
  } as React.CSSProperties,

  contractDate: {
    fontSize: "11px",
    color: "var(--steel)",
  } as React.CSSProperties,

  // Status Badge
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  } as React.CSSProperties,

  statusActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
    color: "#16a34a",
  } as React.CSSProperties,

  statusInactive: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#dc2626",
  } as React.CSSProperties,

  // Actions
  actions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  } as React.CSSProperties,

  viewButton: {
    padding: "8px",
    backgroundColor: "var(--steel)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
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
