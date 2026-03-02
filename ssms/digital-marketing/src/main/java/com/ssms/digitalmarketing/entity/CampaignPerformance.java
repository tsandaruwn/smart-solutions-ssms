package com.ssms.digitalmarketing.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * CAMPAIGN_PERFORMANCE entity – time-series metrics snapshot per campaign day.
 *
 * Columns (from ER):
 * perf_id INT (AUTO_INCREMENT) PK
 * campaign_id INT FK → CAMPAIGN
 * recorded_date DATE
 * impressions INT DEFAULT 0
 * clicks INT DEFAULT 0
 * conversions INT DEFAULT 0
 * revenue_generated DECIMAL(12,2)
 * cost_incurred DECIMAL(12,2)
 */
@Entity
@Table(name = "campaign_performance", uniqueConstraints = @UniqueConstraint(name = "uq_campaign_date", columnNames = {
        "campaign_id", "recorded_date" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "perf_id")
    private Integer perfId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate;

    @Column(name = "impressions")
    @Builder.Default
    private Integer impressions = 0;

    @Column(name = "clicks")
    @Builder.Default
    private Integer clicks = 0;

    @Column(name = "conversions")
    @Builder.Default
    private Integer conversions = 0;

    @Column(name = "revenue_generated", precision = 12, scale = 2)
    private BigDecimal revenueGenerated;

    @Column(name = "cost_incurred", precision = 12, scale = 2)
    private BigDecimal costIncurred;

    // ─── Derived helpers ─────────────────────────────────────────

    /** Click-through rate = clicks / impressions (0 if impressions == 0). */
    @Transient
    public double getClickThroughRate() {
        if (impressions == null || impressions == 0)
            return 0.0;
        return (double) clicks / impressions * 100;
    }

    /** Conversion rate = conversions / clicks (0 if clicks == 0). */
    @Transient
    public double getConversionRate() {
        if (clicks == null || clicks == 0)
            return 0.0;
        return (double) conversions / clicks * 100;
    }

    /** Return on ad spend = revenue / cost (0 if cost == 0). */
    @Transient
    public double getRoas() {
        if (costIncurred == null || costIncurred.compareTo(BigDecimal.ZERO) == 0)
            return 0.0;
        return revenueGenerated.divide(costIncurred, 4, java.math.RoundingMode.HALF_UP).doubleValue();
    }
}
