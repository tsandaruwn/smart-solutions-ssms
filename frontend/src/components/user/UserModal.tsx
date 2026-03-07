import { useState, useEffect } from "react";
import { X, Save, UserPlus } from "lucide-react";
import { userApi } from "@/lib/userApi";
import type { User, Role, CreateUserRequest, UpdateUserRequest } from "@/types/user";

interface UserModalProps {
  user: User | null;
  roles: Role[];
  onClose: () => void;
  onSave: () => void;
}

export default function UserModal({ user, roles, onClose, onSave }: UserModalProps) {
  const isEditMode = !!user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    roleId: user?.roleId || (roles[0]?.roleId || 1),
    isActive: user?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value)
          : value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        
        const updateData: UpdateUserRequest = {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          roleId: formData.roleId,
          isActive: formData.isActive,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        await userApi.updateUser(user.userId, updateData);
      } else {
        
        const createData: CreateUserRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          roleId: formData.roleId,
        };
        await userApi.createUser(createData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <UserPlus size={24} color="#FAB95B" />
            </div>
            <h2 style={styles.title}>
              {isEditMode ? "Edit User" : "Create New User"}
            </h2>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        {}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <span>{error}</span>
            </div>
          )}

          <div style={styles.formGrid}>
            {}
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                required
                minLength={3}
                maxLength={80}
              />
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password {isEditMode ? "(leave blank to keep current)" : "*"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required={!isEditMode}
                minLength={6}
              />
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="roleId" style={styles.label}>
                Role *
              </label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                style={styles.select}
                required
              >
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="firstName" style={styles.label}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="lastName" style={styles.label}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {}
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {}
            {isEditMode && (
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  <span>Active User</span>
                </label>
              </div>
            )}
          </div>

          {}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.saveButton} disabled={loading}>
              <Save size={18} />
              <span>{loading ? "Saving..." : isEditMode ? "Update User" : "Create User"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 50, 99, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(26, 50, 99, 0.3)",
    border: "3px solid #1A3263",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "2px solid #E8E2DB",
    backgroundColor: "#1A3263",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#547792",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700" as const,
    color: "#FAB95B",
    margin: 0,
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FAB95B",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  } as React.CSSProperties,
  form: {
    padding: "24px",
  },
  errorBox: {
    backgroundColor: "#fee",
    border: "2px solid #fcc",
    borderRadius: "8px",
    padding: "12px",
    color: "#c33",
    fontSize: "14px",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#1A3263",
  },
  input: {
    padding: "12px",
    border: "2px solid #547792",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  select: {
    padding: "12px",
    border: "2px solid #547792",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#1A3263",
    cursor: "pointer",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingTop: "24px",
    borderTop: "2px solid #E8E2DB",
  },
  cancelButton: {
    backgroundColor: "#E8E2DB",
    color: "#1A3263",
    padding: "12px 24px",
    border: "2px solid #547792",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600" as const,
    cursor: "pointer",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  saveButton: {
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
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(250, 185, 91, 0.4)",
  } as React.CSSProperties,
};
