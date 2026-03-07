import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (users.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>No users found</p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Last Login</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} style={styles.row}>
              <td style={styles.td}>{user.userId}</td>
              <td style={styles.td}>
                <strong style={styles.username}>{user.username}</strong>
              </td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "-"}
              </td>
              <td style={styles.td}>{user.phone || "-"}</td>
              <td style={styles.td}>
                <span style={styles.roleBadge}>{user.roleName}</span>
              </td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(user.isActive
                      ? styles.statusActive
                      : styles.statusInactive),
                  }}
                >
                  {user.isActive ? (
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
                </span>
              </td>
              <td style={styles.td}>{formatDate(user.lastLogin)}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    onClick={() => onEdit(user)}
                    style={styles.editButton}
                    title="Edit user"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user.userId)}
                    style={styles.deleteButton}
                    title="Delete user"
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
  username: {
    color: "#547792",
    fontWeight: "600" as const,
  },
  roleBadge: {
    backgroundColor: "#547792",
    color: "white",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600" as const,
    display: "inline-block",
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
  statusActive: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusInactive: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
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
