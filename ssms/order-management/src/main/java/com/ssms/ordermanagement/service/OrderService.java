package com.ssms.ordermanagement.service;

import com.ssms.ordermanagement.dto.*;
import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.entity.OrderItem;
import com.ssms.ordermanagement.entity.OrderStatus;
import com.ssms.ordermanagement.exception.InvalidOrderStateException;
import com.ssms.ordermanagement.exception.OrderNotFoundException;
import com.ssms.ordermanagement.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    // ─── CREATE ─────────────────────────────────────────────────

    /**
     * Place a new order from a CreateOrderRequest DTO.
     */
    @Transactional
    public OrderResponse placeOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .orderNumber(generateUniqueOrderNumber())
                .customerId(request.getCustomerId())
                .createdByUserId(request.getCreatedByUserId())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .notes(request.getNotes())
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        // Map request items → entity items
        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .productId(itemReq.getProductId())
                    .quantity(itemReq.getQuantity())
                    .unitPriceAtOrder(itemReq.getUnitPriceAtOrder())
                    .discountPercent(itemReq.getDiscountPercent() != null
                            ? itemReq.getDiscountPercent() : BigDecimal.ZERO)
                    .build();
            order.addItem(item);
        }

        // Calculate total
        order.recalculateTotalAmount();

        Order saved = orderRepository.save(order);
        log.info("Order placed: {}", saved.getOrderNumber());
        return OrderResponse.fromEntity(saved);
    }

    // ─── READ ───────────────────────────────────────────────────

    /**
     * Get order by primary key (order_id).
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Integer orderId) {
        Order order = findOrderOrThrow(orderId);
        return OrderResponse.fromEntity(order);
    }

    /**
     * Get order by order_number.
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with order number: " + orderNumber));
        return OrderResponse.fromEntity(order);
    }

    /**
     * Get all orders.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get order history for a given customer.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory(Integer customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get orders by status.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get orders by date range.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get recent orders (last 30 days).
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentOrders() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return orderRepository.findRecentOrders(thirtyDaysAgo).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─── UPDATE ─────────────────────────────────────────────────

    /**
     * Update order status (Pending → Shipped → Delivered).
     */
    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        Order order = findOrderOrThrow(orderId);
        validateStatusTransition(order.getStatus(), request.getStatus());

        order.setStatus(request.getStatus());
        Order saved = orderRepository.save(order);
        log.info("Order {} status updated to {}", saved.getOrderNumber(), saved.getStatus());
        return OrderResponse.fromEntity(saved);
    }

    // ─── CANCEL ─────────────────────────────────────────────────

    /**
     * Cancel an order. Only orders that are PENDING can be cancelled.
     */
    @Transactional
    public OrderResponse cancelOrder(Integer orderId, CancelOrderRequest request) {
        Order order = findOrderOrThrow(orderId);

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOrderStateException("Cannot cancel a delivered order");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException("Order is already cancelled");
        }
        if (order.getStatus() == OrderStatus.SHIPPED) {
            throw new InvalidOrderStateException("Cannot cancel a shipped order");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(
                request.getCancellationReason() != null
                        ? request.getCancellationReason()
                        : "Customer requested cancellation");

        Order saved = orderRepository.save(order);
        log.info("Order {} cancelled", saved.getOrderNumber());
        return OrderResponse.fromEntity(saved);
    }

    // ─── DELETE ─────────────────────────────────────────────────

    /**
     * Delete an order (admin use).
     */
    @Transactional
    public void deleteOrder(Integer orderId) {
        Order order = findOrderOrThrow(orderId);
        orderRepository.delete(order);
        log.info("Order {} deleted", order.getOrderNumber());
    }

    // ─── Private helpers ────────────────────────────────────────

    private Order findOrderOrThrow(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    /**
     * Generate a unique order number: ORD-YYYYMMDD-XXXX
     */
    private String generateUniqueOrderNumber() {
        String orderNumber;
        do {
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String uniquePart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            orderNumber = String.format("ORD-%s-%s", dateStr, uniquePart);
        } while (orderRepository.existsByOrderNumber(orderNumber));
        return orderNumber;
    }

    /**
     * Validate that the requested status transition is legal.
     * Allowed transitions: PENDING → SHIPPED → DELIVERED
     */
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException("Cannot update status of a cancelled order");
        }
        if (currentStatus == OrderStatus.DELIVERED) {
            throw new InvalidOrderStateException("Cannot change status of a delivered order");
        }

        boolean valid = switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == OrderStatus.DELIVERED;
            default -> false;
        };

        if (!valid) {
            throw new InvalidOrderStateException(
                    String.format("Invalid status transition from %s to %s", currentStatus, newStatus));
        }
    }
}

