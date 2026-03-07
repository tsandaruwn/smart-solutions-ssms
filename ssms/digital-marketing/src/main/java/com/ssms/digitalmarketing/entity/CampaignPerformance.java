package com.ssms.digitalmarketing.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @Transient
    public double getClickThroughRate() {
        if (impressions == null || impressions == 0)
            return 0.0;
        return (double) clicks / impressions * 100;
    }

    @Transient
    public double getConversionRate() {
        if (clicks == null || clicks == 0)
            return 0.0;
        return (double) conversions / clicks * 100;
    }

    @Transient
    public double getRoas() {
        if (costIncurred == null || costIncurred.compareTo(BigDecimal.ZERO) == 0)
            return 0.0;
        return revenueGenerated.divide(costIncurred, 4, java.math.RoundingMode.HALF_UP).doubleValue();
    }
}
