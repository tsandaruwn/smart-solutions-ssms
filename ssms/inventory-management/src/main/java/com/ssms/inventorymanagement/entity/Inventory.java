package com.ssms.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "inventory",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_inventory_product_warehouse",
                columnNames = {"product_id", "warehouse_id"}
        ),
        indexes = {
                @Index(name = "idx_inventory_product_id",   columnList = "product_id"),
                @Index(name = "idx_inventory_warehouse_id", columnList = "warehouse_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_inventory_warehouse"))
    private Warehouse warehouse;

    @Builder.Default
    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand = 0;

    @Builder.Default
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    @Builder.Default
    @Column(name = "reorder_quantity", nullable = false)
    private Integer reorderQuantity = 50;

    @Builder.Default
    @Column(name = "low_stock_alert_sent", nullable = false)
    private Boolean lowStockAlertSent = Boolean.FALSE;

    @Column(name = "last_restocked_at")
    private LocalDateTime lastRestockedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = Boolean.FALSE;

    public boolean isLowStock() {
        return this.quantityOnHand != null
                && this.reorderLevel != null
                && this.quantityOnHand <= this.reorderLevel;
    }

    @PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
