"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { userApi } from "@/lib/userApi";
import type { User, Role } from "@/types/user";
import UserTable from "@/components/user/UserTable";
import UserModal from "@/components/user/UserModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        userApi.getAllUsers(),
        userApi.getAllRoles(),
      ]);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userApi.deleteUser(userId);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleModalSave = async () => {
    setShowModal(false);
    setSelectedUser(null);
    await fetchData();
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;
  const adminUsers = users.filter((u) => u.roleName === "ADMIN").length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <RefreshCw size={48} color="#FAB95B" className="spin" />
        <p style={styles.loadingText}>Loading user management...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Users size={32} color="#FAB95B" />
          </div>
          <div>
            <h1 style={styles.title}>User Management</h1>
            <p style={styles.subtitle}>Manage system users and roles</p>
          </div>
        </div>
        <button onClick={handleCreateUser} style={styles.createButton}>
          <Plus size={20} />
          <span>Create User</span>
        </button>
      </div>

      {}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Total Users</span>
            <Users size={24} color="#1A3263" />
          </div>
          <p style={styles.statValue}>{users.length}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Active Users</span>
            <Users size={24} color="#28a745" />
          </div>
          <p style={styles.statValue}>{activeUsers}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Inactive Users</span>
            <Users size={24} color="#dc3545" />
          </div>
          <p style={styles.statValue}>{inactiveUsers}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Administrators</span>
            <Users size={24} color="#FAB95B" />
          </div>
          <p style={styles.statValue}>{adminUsers}</p>
        </div>
      </div>

      {}
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={20} color="#547792" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button onClick={fetchData} style={styles.refreshButton}>
          <RefreshCw size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {}
      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {}
      {showModal && (
        <UserModal
          user={selectedUser}
          roles={roles}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

      {}
      <div style={styles.signature}>
        <p>👤 User Management Module - Developed by [Your Name]</p>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#E8E2DB",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#E8E2DB",
    gap: "16px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#547792",
    fontWeight: "600" as const,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "2px solid #1A3263",
    boxShadow: "0 4px 12px rgba(26, 50, 99, 0.1)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    backgroundColor: "#1A3263",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700" as const,
    color: "#1A3263",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#547792",
    margin: 0,
    marginTop: "4px",
  },
  createButton: {
    backgroundColor: "#FAB95B",
    color: "#1A3263",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(250, 185, 91, 0.3)",
  } as React.CSSProperties,
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #547792",
    boxShadow: "0 2px 8px rgba(84, 119, 146, 0.1)",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#547792",
    fontWeight: "600" as const,
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700" as const,
    color: "#1A3263",
    margin: 0,
  },
  controls: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #547792",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#1A3263",
  },
  refreshButton: {
    backgroundColor: "#547792",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  } as React.CSSProperties,
  errorBox: {
    backgroundColor: "#fee",
    border: "2px solid #fcc",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#c33",
    fontSize: "16px",
    marginBottom: "24px",
  },
  signature: {
    marginTop: "32px",
    textAlign: "center" as const,
    padding: "16px",
    backgroundColor: "#1A3263",
    color: "#FAB95B",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700" as const,
  },
};
