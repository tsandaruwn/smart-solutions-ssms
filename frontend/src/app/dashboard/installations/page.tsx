"use client";

import { useEffect, useMemo, useState } from "react";
import {
  installationApi,
  customerApi,
  orderApi,
  technicianApi,
  type InstallationResponse,
  type InstallationRequest,
  type InstallationStatus,
  type StatusUpdate,
  type TechnicianAssignment,
  type CustomerResponse,
  type OrderResponse,
  type TechnicianResponse,
} from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  UserPlus,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatCard from "@/components/ui/StatCard";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS: InstallationStatus[] = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const STATUS_COLORS: Record<InstallationStatus, string> = {
  SCHEDULED: "status-pending",
  IN_PROGRESS: "status-shipped",
  COMPLETED: "status-delivered",
  CANCELLED: "status-cancelled",
};

const STATUS_ICONS: Record<InstallationStatus, React.ReactNode> = {
  SCHEDULED: <Clock size={14} />,
  IN_PROGRESS: <PlayCircle size={14} />,
  COMPLETED: <CheckCircle size={14} />,
  CANCELLED: <XCircle size={14} />,
};

const emptyForm: InstallationRequest = {
  jobReference: "",
  orderId: 0,
  customerId: 0,
  technicianId: 0,
  scheduledByUserId: undefined,
  scheduledDate: "",
  installationAddress: "",
  status: "SCHEDULED",
  technicianNotes: "",
};

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<InstallationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<InstallationStatus | "ALL">("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InstallationRequest>(emptyForm);

  const [statusUpdateId, setStatusUpdateId] = useState<number | null>(null);
  const [statusUpdateValue, setStatusUpdateValue] = useState<InstallationStatus>("IN_PROGRESS");
  const [statusNotes, setStatusNotes] = useState("");

  const [assignId, setAssignId] = useState<number | null>(null);
  const [assignTechId, setAssignTechId] = useState("");
  const [assignTechName, setAssignTechName] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);

  useEffect(() => {
    customerApi.getAll(0, 1000).then((res) => setCustomers(res.content)).catch(() => {});
    orderApi.getAll().then(setOrders).catch(() => {});
    technicianApi.getActive().then(setTechnicians).catch(() => {});
  }, []);

  const loadInstallations = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: InstallationResponse[];
      if (statusFilter !== "ALL") {
        data = await installationApi.getByStatus(statusFilter);
      } else {
        data = await installationApi.getAll();
      }
      setInstallations(data);
      setCurrentPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load installations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, [statusFilter]);

  const stats = useMemo(() => {
    const all = installations;
    return {
      total: all.length,
      scheduled: all.filter((i) => i.status === "SCHEDULED").length,
      inProgress: all.filter((i) => i.status === "IN_PROGRESS").length,
      completed: all.filter((i) => i.status === "COMPLETED").length,
    };
  }, [installations]);

  const totalPages = Math.ceil(installations.length / ITEMS_PER_PAGE);
  const pagedInstallations = installations.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await installationApi.create(form);
      setSuccess("Installation created");
      setShowForm(false);
      setForm(emptyForm);
      await loadInstallations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save installation");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await installationApi.delete(id);
      setSuccess("Installation deleted");
      setDeleteConfirm(null);
      await loadInstallations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdateId) return;
    setError(null);
    try {
      const data: StatusUpdate = { status: statusUpdateValue, notes: statusNotes || undefined };
      await installationApi.updateStatus(statusUpdateId, data);
      setSuccess("Status updated");
      setStatusUpdateId(null);
      setStatusNotes("");
      await loadInstallations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await installationApi.cancel(id);
      setSuccess("Installation cancelled");
      await loadInstallations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  const handleAssign = async () => {
    if (!assignId) return;
    setError(null);
    try {
      const data: TechnicianAssignment = {
        technicianId: parseInt(assignTechId),
        technicianName: assignTechName,
      };
      await installationApi.assignTechnician(assignId, data);
      setSuccess("Technician assigned");
      setAssignId(null);
      setAssignTechId("");
      setAssignTechName("");
      await loadInstallations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign technician");
    }
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  return (
    <div>
      {}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">Installations</h2>
          <p className="text-steel mb-0">Schedule and track installation jobs</p>
        </div>
        <button className="btn btn-amber d-flex align-items-center gap-2" onClick={openCreateForm}>
          <Plus size={18} />
          Schedule Installation
        </button>
      </div>

      {}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard title="Total" value={stats.total} icon={Wrench} color="navy" />
        </div>
        <div className="col-md-3">
          <StatCard title="Scheduled" value={stats.scheduled} icon={Clock} color="amber" />
        </div>
        <div className="col-md-3">
          <StatCard title="In Progress" value={stats.inProgress} icon={PlayCircle} color="steel" />
        </div>
        <div className="col-md-3">
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" />
        </div>
      </div>

      {}
      {success && <div className="alert alert-success mb-3">{success}</div>}
      {error && <ErrorMessage message={error} onRetry={loadInstallations} />}

      {}
      <div className="card card-brand mb-4">
        <div className="card-body py-3">
          <div className="d-flex align-items-center gap-2">
            <Filter size={16} className="text-steel" />
            <button
              className={`filter-pill ${statusFilter === "ALL" ? "active" : ""}`}
              onClick={() => setStatusFilter("ALL")}
            >
              All
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                className={`filter-pill ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card card-brand">
          <div className="table-responsive">
            <table className="table table-brand mb-0">
              <thead>
                <tr>
                  <th>Job Ref</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Scheduled</th>
                  <th>Address</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedInstallations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-steel">
                      No installations found
                    </td>
                  </tr>
                ) : (
                  pagedInstallations.map((inst) => (
                    <tr key={inst.id}>
                      <td className="fw-medium">{inst.jobReference}</td>
                      <td>
                        <span className={`status-badge ${STATUS_COLORS[inst.status]}`}>
                          <span className="d-flex align-items-center gap-1">
                            {STATUS_ICONS[inst.status]}
                            {inst.status.replace("_", " ")}
                          </span>
                        </span>
                      </td>
                      <td>#{inst.orderId}</td>
                      <td>#{inst.customerId}</td>
                      <td>#{inst.technicianId}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={14} className="text-steel" />
                          {inst.scheduledDate
                            ? new Date(inst.scheduledDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>
                      <td>
                        <span
                          className="d-inline-block text-truncate"
                          style={{ maxWidth: 150 }}
                          title={inst.installationAddress}
                        >
                          {inst.installationAddress}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {inst.status !== "COMPLETED" && inst.status !== "CANCELLED" && (
                            <>
                              <button
                                className="btn btn-icon"
                                title="Update Status"
                                onClick={() => {
                                  setStatusUpdateId(inst.id);
                                  setStatusUpdateValue(
                                    inst.status === "SCHEDULED" ? "IN_PROGRESS" : "COMPLETED"
                                  );
                                }}
                              >
                                <PlayCircle size={15} />
                              </button>
                              <button
                                className="btn btn-icon"
                                title="Assign Technician"
                                onClick={() => setAssignId(inst.id)}
                              >
                                <UserPlus size={15} />
                              </button>
                              <button
                                className="btn btn-icon"
                                title="Cancel"
                                onClick={() => handleCancel(inst.id)}
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          {deleteConfirm === inst.id ? (
                            <>
                              <button
                                className="btn btn-sm"
                                style={{ color: "#dc3545", fontSize: ".75rem" }}
                                onClick={() => handleDelete(inst.id)}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-sm text-steel"
                                style={{ fontSize: ".75rem" }}
                                onClick={() => setDeleteConfirm(null)}
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-icon"
                              title="Delete"
                              onClick={() => setDeleteConfirm(inst.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {}
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <span className="text-steel" style={{ fontSize: ".875rem" }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="d-flex gap-1">
                <button
                  className="page-btn"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i ? "active" : ""}`}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {showForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 550, maxHeight: "90vh", overflow: "auto" }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">Schedule Installation</h5>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Job Reference *</label>
                      <input
                        className="input-brand w-100"
                        required
                        placeholder="e.g. JOB-2026-001"
                        value={form.jobReference}
                        onChange={(e) => setForm({ ...form, jobReference: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Scheduled Date *</label>
                      <input
                        type="datetime-local"
                        className="input-brand w-100"
                        required
                        value={form.scheduledDate}
                        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Order *</label>
                      <select
                        className="input-brand w-100"
                        required
                        value={form.orderId || ""}
                        onChange={(e) => setForm({ ...form, orderId: parseInt(e.target.value) || 0 })}
                      >
                        <option value="">Select order</option>
                        {orders.map((o) => (
                          <option key={o.orderId} value={o.orderId}>
                            {o.orderNumber} (#{o.orderId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Customer *</label>
                      <select
                        className="input-brand w-100"
                        required
                        value={form.customerId || ""}
                        onChange={(e) => setForm({ ...form, customerId: parseInt(e.target.value) || 0 })}
                      >
                        <option value="">Select customer</option>
                        {customers.map((c) => (
                          <option key={c.customerId} value={c.customerId}>
                            {c.firstName} {c.lastName} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Technician *</label>
                      <select
                        className="input-brand w-100"
                        required
                        value={form.technicianId || ""}
                        onChange={(e) =>
                          setForm({ ...form, technicianId: parseInt(e.target.value) || 0 })
                        }
                      >
                        <option value="">Select technician</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            #{t.id} – {t.specialization} ({t.availabilityStatus})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Installation Address *</label>
                      <textarea
                        className="textarea-brand w-100"
                        rows={2}
                        required
                        value={form.installationAddress}
                        onChange={(e) => setForm({ ...form, installationAddress: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Notes</label>
                      <textarea
                        className="textarea-brand w-100"
                        rows={2}
                        value={form.technicianNotes}
                        onChange={(e) => setForm({ ...form, technicianNotes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {}
      {statusUpdateId && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setStatusUpdateId(null)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 420 }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">Update Status</h5>
                <button className="btn btn-icon" onClick={() => setStatusUpdateId(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">New Status *</label>
                  <select
                    className="input-brand w-100"
                    value={statusUpdateValue}
                    onChange={(e) => setStatusUpdateValue(e.target.value as InstallationStatus)}
                  >
                    {STATUS_OPTIONS.filter((s) => s !== "CANCELLED").map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label fw-medium">Notes</label>
                  <textarea
                    className="textarea-brand w-100"
                    rows={2}
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-ghost" onClick={() => setStatusUpdateId(null)}>
                  Cancel
                </button>
                <button className="btn btn-amber" onClick={handleStatusUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {}
      {assignId && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setAssignId(null)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 420 }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">Assign Technician</h5>
                <button className="btn btn-icon" onClick={() => setAssignId(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Technician *</label>
                  <select
                    className="input-brand w-100"
                    value={assignTechId}
                    onChange={(e) => {
                      setAssignTechId(e.target.value);
                      const tech = technicians.find((t) => String(t.id) === e.target.value);
                      if (tech) setAssignTechName(`Tech #${tech.id} – ${tech.specialization}`);
                    }}
                  >
                    <option value="">Select technician</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        #{t.id} – {t.specialization} ({t.availabilityStatus})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label fw-medium">Technician Name *</label>
                  <input
                    className="input-brand w-100"
                    value={assignTechName}
                    onChange={(e) => setAssignTechName(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-ghost" onClick={() => setAssignId(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-amber"
                  disabled={!assignTechId || !assignTechName}
                  onClick={handleAssign}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
