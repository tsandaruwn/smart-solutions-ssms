"use client";

import { useEffect, useMemo, useState } from "react";
import {
  campaignApi,
  type CampaignResponse,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type CampaignStatus,
  type CampaignType,
  type PerformanceResponse,
  type CampaignSummary,
  type RecordPerformanceRequest,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Megaphone,
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatCard from "@/components/ui/StatCard";

const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS: CampaignStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"];
const TYPE_OPTIONS: CampaignType[] = [
  "EMAIL",
  "SOCIAL_MEDIA",
  "SEO",
  "PPC",
  "CONTENT",
  "INFLUENCER",
  "AFFILIATE",
  "OTHER",
];

const STATUS_COLORS: Record<CampaignStatus, string> = {
  DRAFT: "status-pending",
  ACTIVE: "status-shipped",
  PAUSED: "status-pending",
  COMPLETED: "status-delivered",
  CANCELLED: "status-cancelled",
};

const emptyForm: CreateCampaignRequest = {
  createdByUserId: 1,
  name: "",
  type: "EMAIL",
  description: "",
  targetAudience: "",
  startDate: "",
  endDate: "",
  budget: 0,
  status: "DRAFT",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");

  // Create / Edit
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCampaignRequest>(emptyForm);

  // Performance
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [perfData, setPerfData] = useState<PerformanceResponse[]>([]);
  const [perfSummary, setPerfSummary] = useState<CampaignSummary | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [showPerfForm, setShowPerfForm] = useState(false);
  const [perfForm, setPerfForm] = useState<RecordPerformanceRequest>({
    recordedDate: new Date().toISOString().split("T")[0],
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenueGenerated: 0,
    costIncurred: 0,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: CampaignResponse[];
      if (statusFilter !== "ALL") {
        data = await campaignApi.getByStatus(statusFilter);
      } else {
        data = await campaignApi.getAll();
      }
      setCampaigns(data);
      setCurrentPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [statusFilter]);

  const loadPerformance = async (campaignId: number) => {
    setPerfLoading(true);
    try {
      const [perf, summary] = await Promise.all([
        campaignApi.getPerformance(campaignId),
        campaignApi.getPerformanceSummary(campaignId).catch(() => null),
      ]);
      setPerfData(perf);
      setPerfSummary(summary);
    } catch (err) {
      setPerfData([]);
      setPerfSummary(null);
    } finally {
      setPerfLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedCampaign === id) {
      setExpandedCampaign(null);
    } else {
      setExpandedCampaign(id);
      loadPerformance(id);
    }
  };

  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "ACTIVE").length,
    draft: campaigns.filter((c) => c.status === "DRAFT").length,
    totalBudget: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
  }), [campaigns]);

  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
  const pagedCampaigns = campaigns.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // CRUD
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (c: CampaignResponse) => {
    setEditingId(c.campaignId);
    setForm({
      createdByUserId: c.createdByUserId,
      name: c.name,
      type: c.type,
      description: c.description || "",
      targetAudience: c.targetAudience || "",
      startDate: c.startDate,
      endDate: c.endDate,
      budget: c.budget,
      status: c.status,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        const updateData: UpdateCampaignRequest = {
          name: form.name,
          type: form.type,
          description: form.description,
          targetAudience: form.targetAudience,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: form.budget,
          status: form.status,
        };
        await campaignApi.update(editingId, updateData);
        setSuccess("Campaign updated");
      } else {
        await campaignApi.create(form);
        setSuccess("Campaign created");
      }
      setShowForm(false);
      setEditingId(null);
      await loadCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await campaignApi.delete(id);
      setSuccess("Campaign deleted");
      setDeleteConfirm(null);
      if (expandedCampaign === id) setExpandedCampaign(null);
      await loadCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

  const handleStatusChange = async (id: number, status: CampaignStatus) => {
    try {
      await campaignApi.updateStatus(id, status);
      setSuccess(`Campaign status updated to ${status}`);
      await loadCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  // Performance
  const handleAddPerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedCampaign) return;
    setError(null);
    try {
      await campaignApi.addPerformance(expandedCampaign, perfForm);
      setSuccess("Performance data recorded");
      setShowPerfForm(false);
      await loadPerformance(expandedCampaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record performance");
    }
  };

  const handleDeletePerf = async (campaignId: number, perfId: number) => {
    try {
      await campaignApi.deletePerformance(campaignId, perfId);
      setSuccess("Performance entry deleted");
      await loadPerformance(campaignId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">Campaigns</h2>
          <p className="text-steel mb-0">Digital marketing campaign management</p>
        </div>
        <button className="btn btn-amber d-flex align-items-center gap-2" onClick={openCreateForm}>
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard title="Total Campaigns" value={stats.total} icon={Megaphone} color="navy" />
        </div>
        <div className="col-md-3">
          <StatCard title="Active" value={stats.active} icon={TrendingUp} color="green" />
        </div>
        <div className="col-md-3">
          <StatCard title="Drafts" value={stats.draft} icon={Edit} color="amber" />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Total Budget"
            value={formatCurrency(stats.totalBudget)}
            icon={DollarSign}
            color="steel"
          />
        </div>
      </div>

      {/* Messages */}
      {success && <div className="alert alert-success mb-3">{success}</div>}
      {error && <ErrorMessage message={error} onRetry={loadCampaigns} />}

      {/* Filters */}
      <div className="card card-brand mb-4">
        <div className="card-body py-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
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
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="d-flex flex-column gap-3">
          {pagedCampaigns.length === 0 ? (
            <div className="card card-brand">
              <div className="card-body text-center py-5 text-steel">No campaigns found</div>
            </div>
          ) : (
            pagedCampaigns.map((c) => (
              <div key={c.campaignId} className="card card-brand">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="mb-0 fw-bold text-navy">{c.name}</h6>
                        <span className={`status-badge ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: "var(--cream)",
                            color: "var(--navy)",
                            fontSize: ".7rem",
                          }}
                        >
                          {c.type?.replace("_", " ")}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-steel mb-1" style={{ fontSize: ".85rem" }}>
                          {c.description}
                        </p>
                      )}
                      <div className="d-flex gap-3 text-steel" style={{ fontSize: ".8rem" }}>
                        <span>
                          {c.startDate} — {c.endDate}
                        </span>
                        <span>Budget: {formatCurrency(c.budget)}</span>
                        {c.targetAudience && <span>Audience: {c.targetAudience}</span>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                      {/* Status quick actions */}
                      {c.status === "DRAFT" && (
                        <button
                          className="btn btn-sm btn-navy"
                          onClick={() => handleStatusChange(c.campaignId, "ACTIVE")}
                        >
                          Activate
                        </button>
                      )}
                      {c.status === "ACTIVE" && (
                        <button
                          className="btn btn-sm btn-steel"
                          onClick={() => handleStatusChange(c.campaignId, "PAUSED")}
                        >
                          Pause
                        </button>
                      )}
                      {c.status === "PAUSED" && (
                        <button
                          className="btn btn-sm btn-navy"
                          onClick={() => handleStatusChange(c.campaignId, "ACTIVE")}
                        >
                          Resume
                        </button>
                      )}
                      <button className="btn btn-icon" onClick={() => openEditForm(c)}>
                        <Edit size={15} />
                      </button>
                      {deleteConfirm === c.campaignId ? (
                        <>
                          <button
                            className="btn btn-sm"
                            style={{ color: "#dc3545", fontSize: ".75rem" }}
                            onClick={() => handleDelete(c.campaignId)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-sm text-steel"
                            style={{ fontSize: ".75rem" }}
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-icon"
                          onClick={() => setDeleteConfirm(c.campaignId)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      <button className="btn btn-icon ms-1" onClick={() => toggleExpand(c.campaignId)}>
                        {expandedCampaign === c.campaignId ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Performance */}
                  {expandedCampaign === c.campaignId && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      {perfLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          {/* Summary Cards */}
                          {perfSummary && (
                            <div className="row g-2 mb-3">
                              <div className="col-md-3">
                                <div className="p-2 rounded-3" style={{ background: "var(--cream)" }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <Eye size={16} className="text-navy" />
                                    <div>
                                      <div style={{ fontSize: ".7rem" }} className="text-steel">
                                        Impressions
                                      </div>
                                      <div className="fw-bold text-navy">
                                        {perfSummary.totalImpressions?.toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="p-2 rounded-3" style={{ background: "var(--cream)" }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <MousePointer size={16} className="text-navy" />
                                    <div>
                                      <div style={{ fontSize: ".7rem" }} className="text-steel">
                                        Clicks (CTR)
                                      </div>
                                      <div className="fw-bold text-navy">
                                        {perfSummary.totalClicks?.toLocaleString()} (
                                        {perfSummary.clickThroughRate})
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="p-2 rounded-3" style={{ background: "var(--cream)" }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <Target size={16} className="text-navy" />
                                    <div>
                                      <div style={{ fontSize: ".7rem" }} className="text-steel">
                                        Conversions
                                      </div>
                                      <div className="fw-bold text-navy">
                                        {perfSummary.totalConversions?.toLocaleString()} (
                                        {perfSummary.conversionRate})
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="p-2 rounded-3" style={{ background: "var(--cream)" }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <DollarSign size={16} className="text-navy" />
                                    <div>
                                      <div style={{ fontSize: ".7rem" }} className="text-steel">
                                        ROAS
                                      </div>
                                      <div className="fw-bold text-navy">{perfSummary.roas}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Performance Table */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-bold text-navy d-flex align-items-center gap-2">
                              <BarChart3 size={16} />
                              Performance Data ({perfData.length})
                            </h6>
                            <button
                              className="btn btn-sm btn-navy d-flex align-items-center gap-1"
                              onClick={() => setShowPerfForm(true)}
                            >
                              <Plus size={14} /> Record
                            </button>
                          </div>

                          {perfData.length === 0 ? (
                            <p className="text-steel mb-0" style={{ fontSize: ".85rem" }}>
                              No performance data yet. Click &quot;Record&quot; to add.
                            </p>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-brand table-sm mb-0">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Impressions</th>
                                    <th>Clicks</th>
                                    <th>Conversions</th>
                                    <th>CTR</th>
                                    <th>Conv Rate</th>
                                    <th style={{ width: 60 }}></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {perfData.map((p) => (
                                    <tr key={p.perfId}>
                                      <td>{p.recordedDate}</td>
                                      <td>{p.impressions?.toLocaleString()}</td>
                                      <td>{p.clicks?.toLocaleString()}</td>
                                      <td>{p.conversions}</td>
                                      <td>{p.clickThroughRate?.toFixed(2)}%</td>
                                      <td>{p.conversionRate?.toFixed(2)}%</td>
                                      <td>
                                        <button
                                          className="btn btn-icon"
                                          onClick={() =>
                                            handleDeletePerf(c.campaignId, p.perfId)
                                          }
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-1 mt-3">
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
          )}
        </div>
      )}

      {/* Campaign Form Modal */}
      {showForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 600, maxHeight: "90vh", overflow: "auto" }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">
                  {editingId ? "Edit Campaign" : "New Campaign"}
                </h5>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Campaign Name *</label>
                      <input
                        className="input-brand w-100"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Type</label>
                      <select
                        className="input-brand w-100"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as CampaignType })}
                      >
                        {TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Status</label>
                      <select
                        className="input-brand w-100"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value as CampaignStatus })
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Description</label>
                      <textarea
                        className="textarea-brand w-100"
                        rows={2}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Target Audience</label>
                      <input
                        className="input-brand w-100"
                        value={form.targetAudience}
                        onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Start Date *</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        required
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">End Date *</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        required
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Budget *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-brand w-100"
                        required
                        value={form.budget || ""}
                        onChange={(e) =>
                          setForm({ ...form, budget: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    {editingId ? "Update" : "Create"} Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Performance Record Modal */}
      {showPerfForm && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowPerfForm(false)} />
          <div
            className="position-fixed d-flex align-items-center justify-content-center"
            style={{ inset: 0, zIndex: 1060 }}
          >
            <div className="card card-brand" style={{ width: 500 }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-navy">Record Performance</h5>
                <button className="btn btn-icon" onClick={() => setShowPerfForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddPerformance}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Date *</label>
                      <input
                        type="date"
                        className="input-brand w-100"
                        required
                        value={perfForm.recordedDate}
                        onChange={(e) =>
                          setPerfForm({ ...perfForm, recordedDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Impressions</label>
                      <input
                        type="number"
                        min="0"
                        className="input-brand w-100"
                        value={perfForm.impressions || ""}
                        onChange={(e) =>
                          setPerfForm({ ...perfForm, impressions: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Clicks</label>
                      <input
                        type="number"
                        min="0"
                        className="input-brand w-100"
                        value={perfForm.clicks || ""}
                        onChange={(e) =>
                          setPerfForm({ ...perfForm, clicks: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Conversions</label>
                      <input
                        type="number"
                        min="0"
                        className="input-brand w-100"
                        value={perfForm.conversions || ""}
                        onChange={(e) =>
                          setPerfForm({ ...perfForm, conversions: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Revenue</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-brand w-100"
                        value={perfForm.revenueGenerated || ""}
                        onChange={(e) =>
                          setPerfForm({
                            ...perfForm,
                            revenueGenerated: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-brand w-100"
                        value={perfForm.costIncurred || ""}
                        onChange={(e) =>
                          setPerfForm({
                            ...perfForm,
                            costIncurred: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowPerfForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-amber">
                    Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
