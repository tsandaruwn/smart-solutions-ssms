package com.ssms.inventorymanagement.dto.request;

import com.ssms.inventorymanagement.utility.constant.AppConstants;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockUpdateRequest {

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be a positive number")
    private Integer quantity;

    @NotBlank(message = "Operation type is required")
    @Pattern(
            regexp = AppConstants.STOCK_OPERATION_PATTERN,
            message = "Operation must be one of: INCREASE, DECREASE, SET"
    )
    private String operation;

    @Size(max = 255, message = "Reason must not exceed 255 characters")
    private String reason;
}
