"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import { userApi } from "@/lib/userApi";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      
      if (formData.username && formData.password) {
        
        const users = await userApi.getAllUsers();
        const user = users.find((u) => u.username === formData.username && u.isActive);

        if (user) {
          
          await userApi.updateLastLogin(user.userId);
          
          localStorage.setItem("currentUser", JSON.stringify(user));
          
          router.push("/dashboard/users");
        } else {
          setError("Invalid username or password. User may be inactive.");
        }
      } else {
        setError("Please enter both username and password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {}
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <LogIn size={40} color="#FAB95B" />
          </div>
          <h1 style={styles.title}>Smart Solutions SSMS</h1>
          <p style={styles.subtitle}>User Management System</p>
        </div>

        {}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              <User size={18} />
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Demo: Use any existing username from the system
          </p>
        </div>
      </div>

      {}
      <div style={styles.signature}>
        <p>🔐 Login Module - Developed by [Your Name]</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E2DB",
    padding: "20px",
  },
  loginCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(26, 50, 99, 0.15)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    border: "3px solid #1A3263",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#1A3263",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 4px 12px rgba(26, 50, 99, 0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700" as const,
    color: "#1A3263",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#547792",
    fontWeight: "500" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  errorBox: {
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#c33",
    fontSize: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#1A3263",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #547792",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
  } as React.CSSProperties,
  loginButton: {
    backgroundColor: "#FAB95B",
    color: "#1A3263",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "700" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(250, 185, 91, 0.4)",
  } as React.CSSProperties,
  footer: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #E8E2DB",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "13px",
    color: "#547792",
    fontStyle: "italic" as const,
  },
  signature: {
    marginTop: "24px",
    textAlign: "center" as const,
    color: "#547792",
    fontSize: "14px",
    fontWeight: "600" as const,
  },
};
