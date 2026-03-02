package com.ssms.inventorymanagement.dto.request;

import com.ssms.inventorymanagement.utility.constant.AppConstants;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Request DTO for adjusting the stock quantity of an existing inventory record.
 *
 * <p>Stock operations are:
 * <ul>
 *   <li>{@code INCREASE} — add units (e.g. order delivery / restock)</li>
 *   <li>{@code DECREASE} — remove units (e.g. order placement / damage)</li>
 *   <li>{@code SET}      — override the quantity directly (e.g. physical count)</li>
 * </ul>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockUpdateRequest {

    /**
     * How many units to add, remove, or set (absolute value).
     * Must be a positive integer.
     */
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be a positive number")
    private Integer quantity;

    /**
     * The operation to apply to the stock.
     * Allowed values: {@code INCREASE}, {@code DECREASE}, {@code SET}.
     */
    @NotBlank(message = "Operation type is required")
    @Pattern(
            regexp = AppConstants.STOCK_OPERATION_PATTERN,
            message = "Operation must be one of: INCREASE, DECREASE, SET"
    )
    private String operation;

    /**
     * Optional human-readable reason for the adjustment
     * (e.g. "Order #1234 dispatched", "Stock count correction").
     */
    @Size(max = 255, message = "Reason must not exceed 255 characters")
    private String reason;
}
