package com.ssms.inventorymanagement.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long inventoryId;
    private Long productId;

    private WarehouseResponse warehouse;

    private Integer quantityOnHand;
    private Integer reorderLevel;
    private Integer reorderQuantity;
    private Boolean lowStockAlertSent;

    private Boolean lowStock;

    private LocalDateTime lastRestockedAt;
    private LocalDateTime updatedAt;
}
