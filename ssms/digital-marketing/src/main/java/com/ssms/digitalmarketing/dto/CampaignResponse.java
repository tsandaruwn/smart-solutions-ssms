package com.ssms.digitalmarketing.dto;

import com.ssms.digitalmarketing.entity.Campaign;
import com.ssms.digitalmarketing.entity.CampaignStatus;
import com.ssms.digitalmarketing.entity.CampaignType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for Campaign.
 */
@Data
@Builder
public class CampaignResponse {

    private Integer campaignId;
    private Integer createdByUserId;
    private String name;
    private CampaignType type;
    private String description;
    private String targetAudience;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private CampaignStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CampaignResponse fromEntity(Campaign c) {
        return CampaignResponse.builder()
                .campaignId(c.getCampaignId())
                .createdByUserId(c.getCreatedByUserId())
                .name(c.getName())
                .type(c.getType())
                .description(c.getDescription())
                .targetAudience(c.getTargetAudience())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .budget(c.getBudget())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
