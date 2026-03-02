package com.ssms.digitalmarketing.dto;

import com.ssms.digitalmarketing.entity.CampaignStatus;
import com.ssms.digitalmarketing.entity.CampaignType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for creating a new Campaign.
 */
@Data
public class CreateCampaignRequest {

    @NotNull(message = "Created by user ID is required")
    private Integer createdByUserId;

    @NotBlank(message = "Campaign name is required")
    @Size(max = 150, message = "Campaign name must not exceed 150 characters")
    private String name;

    private CampaignType type;

    private String description;

    private String targetAudience;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be positive")
    @Digits(integer = 10, fraction = 2, message = "Budget format invalid")
    private BigDecimal budget;

    private CampaignStatus status;
}
