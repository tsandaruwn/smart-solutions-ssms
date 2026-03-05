// ====================================
// INSTALLATION TABLE COMPONENT
// Created by: [Your Name]
// Purpose: Display installations in a table with action buttons
// Color Palette: Navy(#1A3263), Slate(#547792), Orange(#FAB95B), Cream(#E8E2DB)
// ====================================

import { Edit, Trash2, CheckCircle, XCircle, Clock, Wrench, Ban } from "lucide-react";
import type { Installation } from "@/types/installation";
import { InstallationStatus } from "@/types/installation";

interface InstallationTableProps {
  installations: Installation[];
  onEdit: (installation: Installation) => void;
  onDelete: (installationId: number) => void;
  onUpdateStatus: (installation: Installation) => void;
}

export default function InstallationTable({
  installations,
  onEdit,
  onDelete,
  onUpdateStatus
}: InstallationTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: InstallationStatus) => {
    switch (status) {
      case InstallationStatus.SCHEDULED:
        return <Clock size={14} />;
      case InstallationStatus.IN_PROGRESS:
        return <Wrench size={14} />;
      case InstallationStatus.COMPLETED:
        return <CheckCircle size={14} />;
      case InstallationStatus.CANCELLED:
        return <Ban size={14} />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: InstallationStatus) => {
    switch (status) {
      case InstallationStatus.SCHEDULED:
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case InstallationStatus.IN_PROGRESS:
        return { backgroundColor: "#d1ecf1", color: "#0c5460" };
      case InstallationStatus.COMPLETED:
        return { backgroundColor: "#d4edda", color: "#155724" };
      case InstallationStatus.CANCELLED:
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
    }
  };

  if (installations.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>No installations found</p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Job Reference</th>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Customer ID</th>
            <th style={styles.th}>Technician ID</th>
            <th style={styles.th}>Scheduled Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {installations.map((installation) => (
            <tr key={installation.id} style={styles.row}>
              <td style={styles.td}>{installation.id}</td>
              <td style={styles.td}>
                <strong style={styles.jobRef}>{installation.jobReference}</strong>
              </td>
              <td style={styles.td}>{installation.orderId}</td>
              <td style={styles.td}>{installation.customerId}</td>
              <td style={styles.td}>{installation.technicianId}</td>
              <td style={styles.td}>{formatDate(installation.scheduledDate)}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(installation.status),
                  }}
                >
                  {getStatusIcon(installation.status)}
                  {installation.status.replace('_', ' ')}
                </span>
              </td>
              <td style={styles.td} title={installation.installationAddress}>
                {installation.installationAddress.length > 30
                  ? `${installation.installationAddress.substring(0, 30)}...`
                  : installation.installationAddress}
              </td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    onClick={() => onEdit(installation)}
                    style={styles.editButton}
                    title="Edit installation"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onUpdateStatus(installation)}
                    style={styles.statusButton}
                    title="Update status"
                  >
                    <Wrench size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(installation.id)}
                    style={styles.deleteButton}
                    title="Delete installation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #1A3263",
    boxShadow: "0 4px 12px rgba(26, 50, 99, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  headerRow: {
    backgroundColor: "#1A3263",
  },
  th: {
    padding: "16px",
    textAlign: "left" as const,
    fontSize: "14px",
    fontWeight: "700" as const,
    color: "#FAB95B",
    borderBottom: "2px solid #547792",
  },
  row: {
    borderBottom: "1px solid #E8E2DB",
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#1A3263",
  },
  jobRef: {
    color: "#547792",
    fontWeight: "600" as const,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600" as const,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    backgroundColor: "#547792",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  statusButton: {
    backgroundColor: "#FAB95B",
    color: "#1A3263",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  emptyState: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "60px",
    textAlign: "center" as const,
    border: "2px solid #1A3263",
  },
  emptyText: {
    fontSize: "18px",
    color: "#547792",
    margin: 0,
  },
};