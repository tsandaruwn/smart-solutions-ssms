package com.ssms.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 80)
    private String city;

    @Column(name = "country", length = 80)
    private String country;

    @Column(name = "manager_user_id")
    private Long managerUserId;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "capacity")
    private Integer capacity;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;
}
