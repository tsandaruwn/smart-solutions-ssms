package com.ssms.ordermanagement.entity;

/**
 * Order status enum matching the database ENUM(Pending, Shipped, Delivered).
 * Cancelled is handled via cancelled_at timestamp rather than status,
 * but included here for application-level cancellation flow.
 */
public enum OrderStatus {
    PENDING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
