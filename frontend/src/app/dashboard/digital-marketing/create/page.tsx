"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Megaphone,
  User,
  Calendar,
  DollarSign,
  Target,
  FileText,
} from "lucide-react";
import { campaignApi, type CampaignStatus, type CampaignType } from "@/lib/api";

const CAMPAIGN_TYPES: { value: CampaignType; label: string }[] = [
  { value: "EMAIL", label: "Email" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "SEO", label: "SEO" },
  { value: "PPC", label: "PPC" },
  { value: "CONTENT", label: "Content" },
  { value: "INFLUENCER", label: "Influencer" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "OTHER", label: "Other" },
];

const CAMPAIGN_STATUSES: { value: CampaignStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [createdByUserId, setCreatedByUserId] = useState("");
  const [type, setType] = useState<CampaignType | "">("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("DRAFT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await campaignApi.create({
        createdByUserId: Number(createdByUserId),
        name,
        type: type || undefined,
        description: description || undefined,
        targetAudience: targetAudience || undefined,
        startDate,
        endDate,
        budget: budget ? Number(budget) : undefined,
        status,
      });
      router.push("/dashboard/digital-marketing");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create campaign",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <Link
        href="/dashboard/digital-marketing"
        className="back-link mb-3 d-inline-flex"
      >
        <ArrowLeft size={16} />
        Back to Campaigns
      </Link>

      <div className="mb-4">
        <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
          Create New Campaign
        </h1>
        <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
          Fill in the details below to launch a new marketing campaign
        </p>
      </div>

      {error && (
        <div
          className="alert alert-danger rounded-3 mb-4"
          style={{ fontSize: ".875rem" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2
              className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
              style={{ fontSize: ".9375rem" }}
            >
              <Megaphone size={16} className="text-steel" /> Campaign Details
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Campaign Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Enter campaign name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-brand"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CampaignType | "")}
                  className="input-brand"
                >
                  <option value="">— Select type —</option>
                  {CAMPAIGN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                  className="input-brand"
                >
                  {CAMPAIGN_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the campaign"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-brand"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audience & Owner */}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2
              className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
              style={{ fontSize: ".9375rem" }}
            >
              <Target size={16} className="text-steel" /> Audience & Owner
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Created By (User ID) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Marketing manager user ID"
                  value={createdByUserId}
                  onChange={(e) => setCreatedByUserId(e.target.value)}
                  className="input-brand"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Young adults 18-35"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="input-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Budget */}
        <div className="card-brand mb-4">
          <div className="card-brand-header">
            <h2
              className="fw-semibold text-navy mb-0 d-flex align-items-center gap-2"
              style={{ fontSize: ".9375rem" }}
            >
              <Calendar size={16} className="text-steel" /> Schedule & Budget
            </h2>
          </div>
          <div className="card-brand-body">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-brand"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-brand"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label
                  className="d-block fw-medium text-navy mb-1"
                  style={{ fontSize: ".875rem" }}
                >
                  Budget ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 5000.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="input-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-3">
          <button type="submit" disabled={loading} className="btn-amber">
            {loading ? "Creating…" : "Create Campaign"}
          </button>
          <Link href="/dashboard/digital-marketing" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
