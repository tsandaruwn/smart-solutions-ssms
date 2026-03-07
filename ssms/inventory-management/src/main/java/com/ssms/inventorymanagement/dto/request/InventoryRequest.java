package com.ssms.inventorymanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be a positive number")
    private Long productId;

    @NotNull(message = "Warehouse ID is required")
    @Positive(message = "Warehouse ID must be a positive number")
    private Long warehouseId;

    @NotNull(message = "Quantity on hand is required")
    @PositiveOrZero(message = "Quantity on hand must be zero or a positive number")
    private Integer quantityOnHand;

    @PositiveOrZero(message = "Reorder level must be zero or a positive number")
    private Integer reorderLevel;

    @Positive(message = "Reorder quantity must be a positive number")
    private Integer reorderQuantity;
}
