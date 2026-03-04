"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Megaphone,
} from "lucide-react";
import {
  campaignApi,
  type CampaignResponse,
  type CampaignStatus,
  type CampaignType,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;

const truncate = (str: string, max: number) =>
  str.length > max ? `${str.slice(0, max)}\u2026` : str;
const STATUS_OPTIONS: (CampaignStatus | "ALL")[] = [
  "ALL",
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];

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

export default function DigitalMarketingPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">(
    "ALL",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getAll();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filtered = useMemo(() => {
    let result = campaigns;
    if (statusFilter !== "ALL")
      result = result.filter((c) => c.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.type?.toLowerCase().includes(q) ||
          c.targetAudience?.toLowerCase().includes(q) ||
          String(c.campaignId).includes(q),
      );
    }
    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [campaigns, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await campaignApi.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.campaignId !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner message="Loading campaigns..." />;

  return (
    <div>
      {/* Backend warning */}
      {error && (
        <div className="warning-banner mb-4">
          <span
            className="animate-pulse rounded-circle bg-amber d-inline-block flex-shrink-0"
            style={{ width: 8, height: 8 }}
          />
          <p className="mb-0 text-amber-dark" style={{ fontSize: ".875rem" }}>
            <strong>Backend not connected</strong> &mdash; Start the Digital
            Marketing service on port 8088 to see live data.
          </p>
          <button
            onClick={fetchCampaigns}
            className="btn-ghost ms-auto"
            style={{ padding: "4px 12px", fontSize: ".75rem" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Digital Marketing
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            {filtered.length} campaign{filtered.length === 1 ? "" : "s"} found
          </p>
        </div>
        <Link href="/dashboard/digital-marketing/create" className="btn-amber">
          <Plus size={16} />
          Create Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by name, type, audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
        <div className="filter-pill-group flex-shrink-0 flex-wrap">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`filter-pill ${statusFilter === status ? "active" : ""}`}
            >
              {status === "ALL"
                ? "All"
                : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-brand">
        {paginated.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
            <Megaphone size={48} className="text-cream-dark" />
            <p
              className="mb-1 text-muted-brand"
              style={{ fontSize: ".875rem" }}
            >
              No campaigns match your criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="btn-ghost"
              style={{
                padding: "4px 12px",
                fontSize: ".875rem",
                color: "var(--amber-dark)",
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-brand">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th className="d-none d-md-table-cell">Type</th>
                  <th className="d-none d-lg-table-cell">Audience</th>
                  <th className="d-none d-sm-table-cell">Duration</th>
                  <th>Status</th>
                  <th className="text-end">Budget</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((campaign) => (
                  <tr key={campaign.campaignId}>
                    <td>
                      <div className="fw-semibold text-navy">
                        {campaign.name}
                      </div>
                      <div
                        className="text-muted-brand d-md-none"
                        style={{ fontSize: ".75rem" }}
                      >
                        {campaign.type ? typeLabel[campaign.type] : "—"}
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell text-muted-brand">
                      {campaign.type ? typeLabel[campaign.type] : "—"}
                    </td>
                    <td className="d-none d-lg-table-cell text-muted-brand">
                      {campaign.targetAudience
                        ? truncate(campaign.targetAudience, 32)
                        : "—"}
                    </td>
                    <td
                      className="d-none d-sm-table-cell text-muted-brand"
                      style={{ fontSize: ".8125rem" }}
                    >
                      {campaign.startDate} → {campaign.endDate}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${statusColors[campaign.status]}`}
                      >
                        {campaign.status.charAt(0) +
                          campaign.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="text-end fw-semibold text-navy">
                      {campaign.budget == null
                        ? "—"
                        : formatCurrency(campaign.budget)}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          href={`/dashboard/digital-marketing/${campaign.campaignId}`}
                          className="btn-ghost"
                          style={{ padding: "4px 8px" }}
                          title="View campaign"
                        >
                          <Eye size={15} />
                        </Link>
                        {deleteConfirm === campaign.campaignId ? (
                          <>
                            <button
                              onClick={() => handleDelete(campaign.campaignId)}
                              className="btn-ghost"
                              style={{
                                padding: "4px 8px",
                                color: "var(--red)",
                              }}
                              title="Confirm delete"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="btn-ghost"
                              style={{ padding: "4px 8px" }}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              setDeleteConfirm(campaign.campaignId)
                            }
                            className="btn-ghost"
                            style={{ padding: "4px 8px", color: "var(--red)" }}
                            title="Delete campaign"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-3">
          <p className="text-muted-brand mb-0" style={{ fontSize: ".8125rem" }}>
            Page {currentPage} of {totalPages}
          </p>
          <div className="d-flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="btn-ghost"
              style={{ padding: "4px 10px" }}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="btn-ghost"
              style={{ padding: "4px 10px" }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
