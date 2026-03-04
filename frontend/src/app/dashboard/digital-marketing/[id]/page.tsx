"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  BarChart2,
  Plus,
  Eye,
  MousePointerClick,
  Users,
} from "lucide-react";
import {
  campaignApi,
  performanceApi,
  type CampaignResponse,
  type CampaignStatus,
  type CampaignType,
  type PerformanceResponse,
  type RecordPerformanceRequest,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

const statusColors: Record<CampaignStatus, string> = {
  DRAFT: "badge-pending",
  ACTIVE: "badge-delivered",
  PAUSED: "badge-shipped",
  COMPLETED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};

const typeLabel: Record<CampaignType, string> = {
  EMAIL: "Email",
  SOCIAL_MEDIA: "Social Media",
  SEO: "SEO",
  PPC: "PPC",
  CONTENT: "Content",
  INFLUENCER: "Influencer",
  AFFILIATE: "Affiliate",
  OTHER: "Other",
};

const NEXT_STATUS: Partial<Record<CampaignStatus, CampaignStatus>> = {
  DRAFT: "ACTIVE",
  ACTIVE: "PAUSED",
  PAUSED: "ACTIVE",
};

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = Number(params.id);

  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse[]>([]);
  const [summary, setSummary] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Record performance form
  const [showPerfForm, setShowPerfForm] = useState(false);
  const [perfDate, setPerfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [impressions, setImpressions] = useState("0");
  const [clicks, setClicks] = useState("0");
  const [conversions, setConversions] = useState("0");
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [camp, perf, summ] = await Promise.all([
        campaignApi.getById(campaignId),
        performanceApi.getByCampaign(campaignId),
        performanceApi.getSummary(campaignId),
      ]);
      setCampaign(camp);
      setPerformance(
        perf.sort((a, b) => b.recordedDate.localeCompare(a.recordedDate)),
      );
      setSummary(summ);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) fetchAll();
  }, [campaignId]);

  const handleStatusChange = async (newStatus: CampaignStatus) => {
    if (!campaign) return;
    setActionLoading(true);
    try {
      const res = await campaignApi.update(campaignId, { status: newStatus });
      if (res.campaign) setCampaign(res.campaign);
      else await fetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    setPerfLoading(true);
    setPerfError(null);
    try {
      const data: RecordPerformanceRequest = {
        recordedDate: perfDate,
        impressions: Number(impressions) || 0,
        clicks: Number(clicks) || 0,
        conversions: Number(conversions) || 0,
        revenueGenerated: revenue ? Number(revenue) : undefined,
        costIncurred: cost ? Number(cost) : undefined,
      };
      await performanceApi.record(campaignId, data);
      // Refresh performance + summary
      const [perf, summ] = await Promise.all([
        performanceApi.getByCampaign(campaignId),
        performanceApi.getSummary(campaignId),
      ]);
      setPerformance(
        perf.sort((a, b) => b.recordedDate.localeCompare(a.recordedDate)),
      );
      setSummary(summ);
      setShowPerfForm(false);
      // Reset form
      setImpressions("0");
      setClicks("0");
      setConversions("0");
      setRevenue("");
      setCost("");
    } catch (err) {
      setPerfError(
        err instanceof Error ? err.message : "Failed to record performance",
      );
    } finally {
      setPerfLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading campaign details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAll} />;
  if (!campaign) return <ErrorMessage message="Campaign not found" />;

  const nextStatus = NEXT_STATUS[campaign.status];

  return (
    <div style={{ maxWidth: 1100 }}>
      <Link
        href="/dashboard/digital-marketing"
        className="back-link mb-3 d-inline-flex"
      >
        <ArrowLeft size={16} /> Back to Campaigns
      </Link>

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-sm-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1
              className="fw-bold text-navy mb-0"
              style={{ fontSize: "1.5rem" }}
            >
              {campaign.name}
            </h1>
            <span className={`status-badge ${statusColors[campaign.status]}`}>
              {campaign.status.charAt(0) +
                campaign.status.slice(1).toLowerCase()}
            </span>
          </div>
          <p
            className="text-muted-brand mb-0 mt-1"
            style={{ fontSize: ".875rem" }}
          >
            {campaign.type ? typeLabel[campaign.type] : "No type"} &bull;
            Campaign #{campaign.campaignId}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {nextStatus && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              disabled={actionLoading}
              className="btn-navy"
              style={{ fontSize: ".8125rem" }}
            >
              <TrendingUp size={14} />
              {nextStatus === "ACTIVE"
                ? "Activate"
                : nextStatus === "PAUSED"
                  ? "Pause"
                  : nextStatus}
            </button>
          )}
          {campaign.status !== "COMPLETED" &&
            campaign.status !== "CANCELLED" && (
              <button
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={actionLoading}
                className="btn-navy"
                style={{ fontSize: ".8125rem", background: "#16a34a" }}
              >
                Mark Completed
              </button>
            )}
          {campaign.status !== "CANCELLED" && (
            <button
              onClick={() => handleStatusChange("CANCELLED")}
              disabled={actionLoading}
              className="btn-ghost"
              style={{ fontSize: ".8125rem", color: "var(--red)" }}
            >
              Cancel Campaign
            </button>
          )}
        </div>
      </div>

      {/* Campaign Info Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card-brand h-100">
            <div className="card-brand-header">
              <h2
                className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
                style={{ fontSize: ".875rem" }}
              >
                <Calendar size={14} className="text-steel" /> Schedule
              </h2>
            </div>
            <div className="card-brand-body">
              <div
                className="d-flex flex-column gap-2"
                style={{ fontSize: ".875rem" }}
              >
                <div className="d-flex justify-content-between">
                  <span className="text-muted-brand">Start</span>
                  <span className="fw-medium text-navy">
                    {campaign.startDate}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted-brand">End</span>
                  <span className="fw-medium text-navy">
                    {campaign.endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card-brand h-100">
            <div className="card-brand-header">
              <h2
                className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
                style={{ fontSize: ".875rem" }}
              >
                <DollarSign size={14} className="text-steel" /> Budget
              </h2>
            </div>
            <div className="card-brand-body">
              <p
                className="fw-bold text-navy mb-0"
                style={{ fontSize: "1.25rem" }}
              >
                {campaign.budget == null
                  ? "—"
                  : formatCurrency(campaign.budget)}
              </p>
              <p
                className="text-muted-brand mb-0"
                style={{ fontSize: ".8125rem" }}
              >
                Allocated budget
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card-brand h-100">
            <div className="card-brand-header">
              <h2
                className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
                style={{ fontSize: ".875rem" }}
              >
                <Target size={14} className="text-steel" /> Audience
              </h2>
            </div>
            <div className="card-brand-body">
              <p
                className="fw-medium text-navy mb-0"
                style={{ fontSize: ".875rem" }}
              >
                {campaign.targetAudience || "Not specified"}
              </p>
              {campaign.description && (
                <p
                  className="text-muted-brand mt-2 mb-0"
                  style={{ fontSize: ".8125rem" }}
                >
                  {campaign.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="row g-3 mb-4">
          {[
            {
              label: "Total Impressions",
              key: "totalImpressions",
              icon: Eye,
              fmt: (v: number) => v.toLocaleString(),
            },
            {
              label: "Total Clicks",
              key: "totalClicks",
              icon: MousePointerClick,
              fmt: (v: number) => v.toLocaleString(),
            },
            {
              label: "Total Conversions",
              key: "totalConversions",
              icon: Users,
              fmt: (v: number) => v.toLocaleString(),
            },
            {
              label: "Total Revenue",
              key: "totalRevenue",
              icon: DollarSign,
              fmt: (v: number) => formatCurrency(v),
            },
            {
              label: "Total Cost",
              key: "totalCost",
              icon: DollarSign,
              fmt: (v: number) => formatCurrency(v),
            },
            {
              label: "Avg. ROAS",
              key: "avgRoas",
              icon: TrendingUp,
              fmt: (v: number) => v.toFixed(2) + "x",
            },
          ].map(({ label, key, icon: Icon, fmt }) => (
            <div key={key} className="col-6 col-lg-4 col-xl-2">
              <div className="card-brand text-center py-3">
                <Icon size={18} className="text-steel mb-2" />
                <p
                  className="fw-bold text-navy mb-0"
                  style={{ fontSize: "1.1rem" }}
                >
                  {summary[key] == null ? "—" : fmt(summary[key])}
                </p>
                <p
                  className="text-muted-brand mb-0"
                  style={{ fontSize: ".75rem" }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Section */}
      <div className="card-brand">
        <div className="card-brand-header">
          <h2
            className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
            style={{ fontSize: ".9375rem" }}
          >
            <BarChart2 size={16} className="text-steel" /> Performance History
          </h2>
          <button
            onClick={() => setShowPerfForm((v) => !v)}
            className="btn-amber"
            style={{ padding: "6px 14px", fontSize: ".8125rem" }}
          >
            <Plus size={14} /> Record Daily Data
          </button>
        </div>

        {/* Record Performance Form */}
        {showPerfForm && (
          <div
            className="card-brand-body"
            style={{ borderBottom: "1px solid var(--cream-dark)" }}
          >
            <h3
              className="fw-semibold text-navy mb-3"
              style={{ fontSize: ".875rem" }}
            >
              Daily Performance Snapshot
            </h3>
            {perfError && (
              <div
                className="alert alert-danger rounded-3 mb-3"
                style={{ fontSize: ".875rem" }}
              >
                {perfError}
              </div>
            )}
            <form onSubmit={handleRecordPerformance}>
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={perfDate}
                    onChange={(e) => setPerfDate(e.target.value)}
                    className="input-brand"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Impressions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="input-brand"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Clicks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    className="input-brand"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Conversions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                    className="input-brand"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Revenue Generated ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="input-brand"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <label
                    className="d-block fw-medium text-navy mb-1"
                    style={{ fontSize: ".8125rem" }}
                  >
                    Cost Incurred ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="input-brand"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={perfLoading}
                  className="btn-amber"
                  style={{ fontSize: ".8125rem" }}
                >
                  {perfLoading ? "Saving…" : "Save Snapshot"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPerfForm(false)}
                  className="btn-ghost"
                  style={{ fontSize: ".8125rem" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Performance Table */}
        {performance.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <BarChart2 size={40} className="text-cream-dark" />
            <p
              className="text-muted-brand mb-0"
              style={{ fontSize: ".875rem" }}
            >
              No performance data recorded yet
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-end">Impressions</th>
                  <th className="text-end">Clicks</th>
                  <th className="text-end d-none d-md-table-cell">CTR%</th>
                  <th className="text-end d-none d-md-table-cell">Conv.</th>
                  <th className="text-end d-none d-lg-table-cell">Revenue</th>
                  <th className="text-end d-none d-lg-table-cell">Cost</th>
                  <th className="text-end">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((p) => (
                  <tr key={p.perfId}>
                    <td className="fw-medium text-navy">{p.recordedDate}</td>
                    <td className="text-end text-muted-brand">
                      {p.impressions.toLocaleString()}
                    </td>
                    <td className="text-end text-muted-brand">
                      {p.clicks.toLocaleString()}
                    </td>
                    <td className="text-end text-muted-brand d-none d-md-table-cell">
                      {(p.clickThroughRate * 100).toFixed(2)}%
                    </td>
                    <td className="text-end text-muted-brand d-none d-md-table-cell">
                      {p.conversions.toLocaleString()}
                    </td>
                    <td className="text-end text-muted-brand d-none d-lg-table-cell">
                      {p.revenueGenerated == null
                        ? "—"
                        : formatCurrency(p.revenueGenerated)}
                    </td>
                    <td className="text-end text-muted-brand d-none d-lg-table-cell">
                      {p.costIncurred == null
                        ? "—"
                        : formatCurrency(p.costIncurred)}
                    </td>
                    <td className="text-end fw-semibold text-navy">
                      {p.roas.toFixed(2)}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
