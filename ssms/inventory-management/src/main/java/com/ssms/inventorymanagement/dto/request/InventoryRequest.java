package com.ssms.inventorymanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Request DTO for creating or updating an {@code Inventory} record.
 *
 * <p>Represents the stock configuration for one product in one warehouse.
 * The {@code productId} maps to a remote Product Management service entity.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    /**
     * Cross-service reference to the product this record tracks.
     * Must be a positive number.
     */
    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be a positive number")
    private Long productId;

    /**
     * ID of the warehouse that holds this stock.
     * Must refer to an active warehouse.
     */
    @NotNull(message = "Warehouse ID is required")
    @Positive(message = "Warehouse ID must be a positive number")
    private Long warehouseId;

    /**
     * Current quantity available in the warehouse.
     * Must be zero or positive.
     */
    @NotNull(message = "Quantity on hand is required")
    @PositiveOrZero(message = "Quantity on hand must be zero or a positive number")
    private Integer quantityOnHand;

    /**
     * Stock level at which a low-stock alert is triggered.
     * Defaults to 10 if not provided.
     */
    @PositiveOrZero(message = "Reorder level must be zero or a positive number")
    private Integer reorderLevel;

    /**
     * Number of units to order when restocking.
     * Defaults to 50 if not provided.
     */
    @Positive(message = "Reorder quantity must be a positive number")
    private Integer reorderQuantity;
}
