package com.ssms.digitalmarketing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RecordPerformanceRequest {

    @NotNull(message = "Recorded date is required")
    private LocalDate recordedDate;

    @Min(value = 0, message = "Impressions cannot be negative")
    private Integer impressions = 0;

    @Min(value = 0, message = "Clicks cannot be negative")
    private Integer clicks = 0;

    @Min(value = 0, message = "Conversions cannot be negative")
    private Integer conversions = 0;

    @DecimalMin(value = "0.0", message = "Revenue generated cannot be negative")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal revenueGenerated;

    @DecimalMin(value = "0.0", message = "Cost incurred cannot be negative")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal costIncurred;
}
