// ====================================
// SUPPLIERS LIST PAGE
// Purpose: Main page for supplier management with CRUD operations
// Route: /dashboard/suppliers
// Color Palette: Navy(#1A3263), Steel(#547792), Amber(#FAB95B), Cream(#E8E2DB)
// ====================================

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Building2,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import SupplierTable from "@/components/supplier/SupplierTable";
import SupplierModal from "@/components/supplier/SupplierModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatCard from "@/components/ui/StatCard";
import { supplierAPI } from "@/lib/supplierApi";
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types/supplier";
import { useRouter } from "next/navigation";

export default function SuppliersPage() {
  const router = useRouter();

  // State management
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  /**
   * Load all suppliers from API
   */
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierAPI.getAllSuppliers();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load suppliers");
      console.error("Error loading suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize page - load suppliers
   */
  useEffect(() => {
    loadSuppliers();
  }, []);

  /**
   * Apply filters whenever search term or status filter changes
   */
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, suppliers]);

  /**
   * Apply search and status filters to suppliers list
   */
  const applyFilters = () => {
    let filtered = [...suppliers];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (supplier) =>
          supplier.companyName.toLowerCase().includes(search) ||
          supplier.email.toLowerCase().includes(search) ||
          supplier.contactPerson.toLowerCase().includes(search) ||
          supplier.city?.toLowerCase().includes(search) ||
          supplier.country?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((supplier) =>
        statusFilter === "active" ? supplier.isActive : !supplier.isActive
      );
    }

    setFilteredSuppliers(filtered);
  };

  /**
   * Handle create new supplier button click
   */
  const handleCreateClick = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  /**
   * Handle edit supplier button click
   */
  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  /**
   * Handle save supplier (create or update)
   */
  const handleSaveSupplier = async (
    supplierData: CreateSupplierRequest | UpdateSupplierRequest
  ) => {
    try {
      if (selectedSupplier) {
        // Update existing supplier
        await supplierAPI.updateSupplier(
          selectedSupplier.supplierId,
          supplierData as UpdateSupplierRequest
        );
      } else {
        // Create new supplier
        await supplierAPI.createSupplier(
          supplierData as CreateSupplierRequest
        );
      }
      await loadSuppliers();
      setIsModalOpen(false);
      setSelectedSupplier(null);
    } catch (err: any) {
      throw err; // Re-throw to be handled by modal
    }
  };

  /**
   * Handle delete supplier with confirmation
   */
  const handleDelete = async (supplierId: number) => {
    const supplier = suppliers.find((s) => s.supplierId === supplierId);
    if (
      !confirm(
        `Are you sure you want to delete "${supplier?.companyName}"?\nThis action will soft-delete the supplier.`
      )
    ) {
      return;
    }

    try {
      await supplierAPI.deleteSupplier(supplierId);
      await loadSuppliers();
    } catch (err: any) {
      alert(`Failed to delete supplier: ${err.message}`);
    }
  };

  /**
   * Handle toggle supplier active status
   */
  const handleToggleStatus = async (
    supplierId: number,
    currentStatus: boolean
  ) => {
    try {
      if (currentStatus) {
        await supplierAPI.deactivateSupplier(supplierId);
      } else {
        await supplierAPI.activateSupplier(supplierId);
      }
      await loadSuppliers();
    } catch (err: any) {
      alert(`Failed to update supplier status: ${err.message}`);
    }
  };

  /**
   * Handle view supplier details
   */
  const handleViewDetails = (supplierId: number) => {
    router.push(`/dashboard/suppliers/${supplierId}`);
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    loadSuppliers();
  };

  /**
   * Calculate statistics from suppliers data
   */
  const calculateStats = () => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter((s) => s.isActive).length;
    const totalProducts = suppliers.reduce(
      (sum, s) => sum + (s.products?.length || 0),
      0
    );

    return {
      totalSuppliers,
      activeSuppliers,
      totalProducts,
    };
  };

  const stats = calculateStats();

  // Loading state
  if (loading && suppliers.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <Building2 size={32} style={{ color: "var(--amber)" }} />
          </div>
          <div>
            <h1 style={styles.title}>Supplier Management</h1>
            <p style={styles.subtitle}>
              Manage your suppliers, contracts, and product relationships
            </p>
          </div>
        </div>
        <button onClick={handleCreateClick} style={styles.createButton}>
          <Plus size={20} />
          Add New Supplier
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={Building2}
          color="navy"
        />
        <StatCard
          title="Active Suppliers"
          value={stats.activeSuppliers}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Active Rate"
          value={`${suppliers.length > 0 ? Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100) : 0}%`}
          icon={TrendingUp}
          color="steel"
        />
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Filters and Actions */}
      <div style={styles.filtersCard}>
        <div style={styles.filtersRow}>
          {/* Search Input */}
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by company name, email, contact, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Status Filter */}
          <div style={styles.filterGroup}>
            <Filter size={18} style={{ color: "var(--steel)" }} />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
              style={styles.filterSelect}
            >
              <option value="all">All Suppliers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            style={styles.refreshButton}
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Results Count */}
        <div style={styles.resultsCount}>
          Showing <strong>{filteredSuppliers.length}</strong> of{" "}
          <strong>{suppliers.length}</strong> suppliers
        </div>
      </div>

      {/* Suppliers Table */}
      <SupplierTable
        suppliers={filteredSuppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
      />

      {/* Supplier Modal for Create/Edit */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
      />
    </div>
  );
}

// ====================================
// STYLES
// Uses brand color palette
// ====================================
const styles = {
  // Container
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

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "16px",
  } as React.CSSProperties,

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  } as React.CSSProperties,

  iconWrapper: {
    width: "60px",
    height: "60px",
    backgroundColor: "rgba(250,185,91,0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--navy)",
  } as React.CSSProperties,

  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "var(--steel)",
  } as React.CSSProperties,

  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "var(--amber)",
    color: "var(--navy)",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(250,185,91,0.3)",
  } as React.CSSProperties,

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  } as React.CSSProperties,

  // Filters
  filtersCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  } as React.CSSProperties,

  filtersRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  searchWrapper: {
    flex: 1,
    minWidth: "300px",
    position: "relative" as const,
  } as React.CSSProperties,

  searchIcon: {
    position: "absolute" as const,
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--steel)",
    pointerEvents: "none" as const,
  } as React.CSSProperties,

  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 40px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--navy)",
    backgroundColor: "var(--surface)",
    transition: "all 0.2s",
  } as React.CSSProperties,

  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "var(--cream-light)",
    borderRadius: "8px",
  } as React.CSSProperties,

  filterSelect: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: "var(--navy)",
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
  } as React.CSSProperties,

  refreshButton: {
    padding: "10px 16px",
    backgroundColor: "var(--steel)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  resultsCount: {
    fontSize: "13px",
    color: "var(--steel)",
  } as React.CSSProperties,
};
