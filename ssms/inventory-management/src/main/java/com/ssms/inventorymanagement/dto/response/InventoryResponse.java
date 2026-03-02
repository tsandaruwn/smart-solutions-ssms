package com.ssms.inventorymanagement.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response DTO returned to API consumers for {@code Inventory} resources.
 *
 * <p>Includes a convenience {@code lowStock} flag so consumers do not need
 * to re-implement the comparison logic on their side.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long inventoryId;
    private Long productId;

    /** Embedded warehouse summary — avoids a separate API round-trip. */
    private WarehouseResponse warehouse;

    private Integer quantityOnHand;
    private Integer reorderLevel;
    private Integer reorderQuantity;
    private Boolean lowStockAlertSent;

    /** Computed flag: {@code true} when quantityOnHand <= reorderLevel. */
    private Boolean lowStock;

    private LocalDateTime lastRestockedAt;
    private LocalDateTime updatedAt;
}
