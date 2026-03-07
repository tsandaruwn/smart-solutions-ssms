package com.ssms.digitalmarketing.dto;

import com.ssms.digitalmarketing.entity.CampaignPerformance;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PerformanceResponse {

    private Integer perfId;
    private Integer campaignId;
    private String campaignName;
    private LocalDate recordedDate;
    private Integer impressions;
    private Integer clicks;
    private Integer conversions;
    private BigDecimal revenueGenerated;
    private BigDecimal costIncurred;
    private double clickThroughRate;
    private double conversionRate;
    private double roas;

    public static PerformanceResponse fromEntity(CampaignPerformance p) {
        return PerformanceResponse.builder()
                .perfId(p.getPerfId())
                .campaignId(p.getCampaign().getCampaignId())
                .campaignName(p.getCampaign().getName())
                .recordedDate(p.getRecordedDate())
                .impressions(p.getImpressions())
                .clicks(p.getClicks())
                .conversions(p.getConversions())
                .revenueGenerated(p.getRevenueGenerated())
                .costIncurred(p.getCostIncurred())
                .clickThroughRate(p.getClickThroughRate())
                .conversionRate(p.getConversionRate())
                .roas(p.getRoas())
                .build();
    }
}
