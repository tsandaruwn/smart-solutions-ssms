package com.ssms.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a physical warehouse / storage location.
 *
 * <p>The {@code manager_user_id} column is a cross-service reference to the
 * User Management service; it is stored as a plain {@code Long} (no FK
 * constraint) to preserve microservice autonomy.
 */
@Entity
@Table(
        name = "warehouse",
        indexes = {
                @Index(name = "idx_warehouse_city",    columnList = "city"),
                @Index(name = "idx_warehouse_country", columnList = "country"),
                @Index(name = "idx_warehouse_active",  columnList = "is_active")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    /** Surrogate primary key — auto-incremented by PostgreSQL. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    /** Human-readable warehouse name. */
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /** Full street / postal address. */
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    /** City where the warehouse is located. */
    @Column(name = "city", length = 80)
    private String city;

    /** Country where the warehouse is located. */
    @Column(name = "country", length = 80)
    private String country;

    /**
     * ID of the manager user (cross-service reference to User Management).
     * No database-level FK to maintain loose coupling between services.
     */
    @Column(name = "manager_user_id")
    private Long managerUserId;

    /** Contact phone number for the warehouse. */
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    /** Maximum storage capacity (in units). */
    @Column(name = "capacity")
    private Integer capacity;

    /** Whether this warehouse is currently operational. */
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;
}
