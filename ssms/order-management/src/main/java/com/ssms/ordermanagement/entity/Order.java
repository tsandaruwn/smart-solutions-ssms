package com.ssms.ordermanagement.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ORDER entity – represents a purchase record.
 *
 * Columns (from ER):
 *   order_id           INT (AUTO_INCREMENT) PK
 *   order_number       VARCHAR(30) AUTO-GENERATED UK
 *   customer_id        INT FK → CUSTOMER
 *   created_by_user_id INT FK → USER
 *   order_date         TIMESTAMP DEFAULT NOW()
 *   status             ENUM(Pending, Shipped, Delivered)
 *   shipping_address   TEXT
 *   shipping_city      VARCHAR(80)
 *   total_amount       DECIMAL(12,2)
 *   notes              TEXT
 *   cancelled_at       TIMESTAMP
 *   cancellation_reason TEXT
 *   updated_at         TIMESTAMP
 */
@Entity
@Table(name = "\"order\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "order_number", length = 30, unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "created_by_user_id")
    private Integer createdByUserId;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "shipping_city", length = 80)
    private String shippingCity;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // ─── Helpers ────────────────────────────────────────────────

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    /**
     * Recalculate total_amount from line items.
     */
    public void recalculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(OrderItem::computeLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ─── JPA callbacks ──────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
        if (status == null) {
            status = OrderStatus.PENDING;
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

