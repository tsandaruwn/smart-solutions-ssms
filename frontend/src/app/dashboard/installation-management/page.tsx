// ====================================
// INSTALLATION MANAGEMENT DASHBOARD
// Created by: [Your Name]
// Purpose: Complete installation management system with CRUD operations
// ====================================

"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, Search, Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { installationApi } from "@/lib/installationApi";
import type { Installation } from "@/types/installation";
import { InstallationStatus } from "@/types/installation";
import InstallationModal from "@/components/installation/InstallationModal";
import StatusUpdateModal from "@/components/installation/StatusUpdateModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function InstallationManagementPage() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InstallationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);

  useEffect(() => {
    loadInstallations();
  }, []);

  async function loadInstallations() {
    try {
      setLoading(true);
      setError(null);
      const data = await installationApi.getAllInstallations();
      setInstallations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load installations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this installation?")) return;
    try {
      await installationApi.deleteInstallation(id);
      await loadInstallations();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete installation");
    }
  }

  const filteredInstallations = installations.filter((inst) => {
    const matchesStatus = filterStatus === "ALL" || inst.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      inst.jobReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.installationAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function getStatusBadgeClass(status: InstallationStatus) {
    switch (status) {
      case InstallationStatus.COMPLETED:
        return { background: "#d1fae5", color: "#065f46" };
      case InstallationStatus.CANCELLED:
        return { background: "#fee2e2", color: "#991b1b" };
      case InstallationStatus.IN_PROGRESS:
        return { background: "rgba(84,119,146,.15)", color: "var(--steel-dark)" };
      case InstallationStatus.SCHEDULED:
        return { background: "rgba(250,185,91,.15)", color: "var(--amber-dark)" };
      default:
        return { background: "var(--cream)", color: "var(--navy)" };
    }
  }

  function getStatusIcon(status: InstallationStatus) {
    switch (status) {
      case InstallationStatus.COMPLETED:
        return <CheckCircle size={14} />;
      case InstallationStatus.CANCELLED:
        return <XCircle size={14} />;
      case InstallationStatus.IN_PROGRESS:
        return <Wrench size={14} />;
      case InstallationStatus.SCHEDULED:
        return <Clock size={14} />;
      default:
        return null;
    }
  }

  const stats = [
    { label: "Total", count: installations.length, icon: Wrench },
    { label: "Scheduled", count: installations.filter((i) => i.status === InstallationStatus.SCHEDULED).length, icon: Clock },
    { label: "In Progress", count: installations.filter((i) => i.status === InstallationStatus.IN_PROGRESS).length, icon: Wrench },
    { label: "Completed", count: installations.filter((i) => i.status === InstallationStatus.COMPLETED).length, icon: CheckCircle },
    { label: "Cancelled", count: installations.filter((i) => i.status === InstallationStatus.CANCELLED).length, icon: XCircle },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading installations..." />;
  }

  return (
    <div>
      {/* Page header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Installation Management
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            {filteredInstallations.length} installation{filteredInstallations.length === 1 ? "" : "s"} found
          </p>
        </div>
        <button onClick={() => { setSelectedInstallation(null); setShowModal(true); }} className="btn-amber d-flex align-items-center gap-2">
          <Plus size={16} />
          Schedule Installation
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="warning-banner mb-4">
          <span className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0" style={{ width: 8, height: 8 }} />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="col-12 col-sm-6 col-lg-4 col-xl-2-4">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted-brand mb-2" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
                      {stat.label}
                    </p>
                    <p className="fw-bold text-navy mb-0" style={{ fontSize: "1.75rem" }}>
                      {stat.count}
                    </p>
                  </div>
                  <div className="stat-icon bg-navy-subtle">
                    <Icon size={20} className="text-navy" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by job reference or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
        <div className="filter-pill-group flex-shrink-0">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`filter-pill ${filterStatus === "ALL" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus(InstallationStatus.SCHEDULED)}
            className={`filter-pill ${filterStatus === InstallationStatus.SCHEDULED ? "active" : ""}`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilterStatus(InstallationStatus.IN_PROGRESS)}
            className={`filter-pill ${filterStatus === InstallationStatus.IN_PROGRESS ? "active" : ""}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus(InstallationStatus.COMPLETED)}
            className={`filter-pill ${filterStatus === InstallationStatus.COMPLETED ? "active" : ""}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus(InstallationStatus.CANCELLED)}
            className={`filter-pill ${filterStatus === InstallationStatus.CANCELLED ? "active" : ""}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Installations Table */}
      <div className="card-brand">
        {filteredInstallations.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <Wrench size={48} className="text-cream-dark" />
            <p className="mb-1 text-muted-brand" style={{ fontSize: ".875rem" }}>
              No installations found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("ALL");
              }}
              className="btn-ghost"
              style={{ padding: "4px 12px", fontSize: ".875rem", color: "var(--amber-dark)" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job Reference</th>
                  <th className="d-none d-lg-table-cell">Customer</th>
                  <th className="d-none d-md-table-cell">Address</th>
                  <th className="d-none d-xl-table-cell">Scheduled</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstallations.map((inst) => {
                  const statusStyle = getStatusBadgeClass(inst.status);
                  const StatusIcon = getStatusIcon(inst.status);
                  return (
                    <tr key={inst.id}>
                      <td>
                        <span className="fw-semibold text-navy" style={{ fontSize: ".875rem" }}>
                          #{inst.id}
                        </span>
                      </td>
                      <td>
                        <code className="text-muted-brand" style={{ fontSize: ".8rem" }}>
                          {inst.jobReference}
                        </code>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <span className="text-navy" style={{ fontSize: ".875rem" }}>
                          Customer #{inst.customerId}
                        </span>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <span className="text-steel-dark" style={{ fontSize: ".875rem" }}>
                          {inst.installationAddress.length > 30 ? `${inst.installationAddress.substring(0, 30)}...` : inst.installationAddress}
                        </span>
                      </td>
                      <td className="d-none d-xl-table-cell">
                        <span className="text-muted-brand" style={{ fontSize: ".75rem" }}>
                          {new Date(inst.scheduledDate).toLocaleDateString()}<br />
                          {new Date(inst.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge sm d-inline-flex align-items-center gap-1" style={statusStyle}>
                          {StatusIcon}
                          {inst.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedInstallation(inst);
                              setShowStatusModal(true);
                            }}
                            className="btn-icon"
                            title="Update status"
                            style={{ color: "var(--amber-dark)" }}
                          >
                            <Wrench size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInstallation(inst);
                              setShowModal(true);
                            }}
                            className="btn-icon"
                            title="Edit installation"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(inst.id)}
                            className="btn-icon"
                            title="Delete installation"
                            style={{ color: "var(--steel)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                              (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = "var(--steel)";
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Installation Modal */}
      {showModal && (
        <InstallationModal
          installation={selectedInstallation}
          onClose={() => {
            setShowModal(false);
            setSelectedInstallation(null);
          }}
          onSave={async () => {
            setShowModal(false);
            setSelectedInstallation(null);
            await loadInstallations();
          }}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedInstallation && (
        <StatusUpdateModal
          installation={selectedInstallation}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedInstallation(null);
          }}
          onSave={async () => {
            setShowStatusModal(false);
            setSelectedInstallation(null);
            await loadInstallations();
          }}
        />
      )}
    </div>
  );
}