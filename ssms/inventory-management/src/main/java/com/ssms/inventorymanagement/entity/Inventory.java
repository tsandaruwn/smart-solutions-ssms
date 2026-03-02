package com.ssms.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Tracks stock levels for a specific product in a specific warehouse.
 *
 * <p>The composite unique constraint {@code uq_inventory_product_warehouse}
 * (product_id, warehouse_id) ensures that the same product cannot have two
 * separate records in the same warehouse.
 *
 * <p>{@code product_id} is a cross-service reference to the Product Management
 * service; no database-level FK is added to preserve microservice autonomy.
 */
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

    /** Surrogate primary key — auto-incremented by PostgreSQL. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    /**
     * Product reference — cross-service FK to the Product Management service.
     * Stored as a plain Long; validation against the remote service is done
     * in the service layer via OpenFeign.
     */
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /**
     * The warehouse that holds this stock.
     * Loaded lazily to avoid unnecessary joins.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_inventory_warehouse"))
    private Warehouse warehouse;

    /** Current quantity available in the warehouse. */
    @Builder.Default
    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand = 0;

    /**
     * Threshold below which a low-stock alert should be triggered.
     * Defaults to 10 if not explicitly set.
     */
    @Builder.Default
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    /**
     * How many units should be ordered when restocking.
     * Defaults to 50 if not explicitly set.
     */
    @Builder.Default
    @Column(name = "reorder_quantity", nullable = false)
    private Integer reorderQuantity = 50;

    /** Flag to avoid sending duplicate low-stock notifications. */
    @Builder.Default
    @Column(name = "low_stock_alert_sent", nullable = false)
    private Boolean lowStockAlertSent = Boolean.FALSE;

    /** Timestamp of the most recent restock event. */
    @Column(name = "last_restocked_at")
    private LocalDateTime lastRestockedAt;

    /** Timestamp when this record was last modified. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** Soft-delete flag — set to true instead of physically removing the row. */
    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = Boolean.FALSE;

    // ─────────────────────────────────────────────────────────────────────
    // Business-logic helpers
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns {@code true} if the current stock is at or below the reorder
     * level, meaning a low-stock alert should be issued.
     *
     * @return {@code true} when a restock is needed
     */
    public boolean isLowStock() {
        return this.quantityOnHand != null
                && this.reorderLevel != null
                && this.quantityOnHand <= this.reorderLevel;
    }

    // ─────────────────────────────────────────────────────────────────────
    // Lifecycle hooks
    // ─────────────────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
