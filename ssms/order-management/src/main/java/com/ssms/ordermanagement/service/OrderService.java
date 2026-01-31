package com.ssms.ordermanagement.service;

import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    /**
     * Place a new order
     */
    @Transactional
    public Order placeOrder(Order order) {
        // Generate unique order ID
        order.setOrderId(generateUniqueOrderId());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        
        return orderRepository.save(order);
    }

    /**
     * Generate unique order ID
     */
    private String generateUniqueOrderId() {
        String orderId;
        do {
            // Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20260131-A1B2)
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String uniquePart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            orderId = String.format("ORD-%s-%s", dateStr, uniquePart);
        } while (orderRepository.existsByOrderId(orderId));
        
        return orderId;
    }

    /**
     * Get order by ID
     */
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    /**
     * Get order by order ID
     */
    public Order getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with orderId: " + orderId));
    }

    /**
     * Get all orders
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Get order history for a customer
     */
    public List<Order> getOrderHistory(Long customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    /**
     * Update order status
     */
    @Transactional
    public Order updateOrderStatus(String orderId, Order.OrderStatus newStatus) {
        Order order = getOrderByOrderId(orderId);
        
        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);
        
        order.setStatus(newStatus);
        
        // Update timestamp based on status
        switch (newStatus) {
            case SHIPPED:
                order.setShippedDate(LocalDateTime.now());
                break;
            case DELIVERED:
                order.setDeliveredDate(LocalDateTime.now());
                break;
            case CANCELLED:
                order.setCancelledDate(LocalDateTime.now());
                break;
        }
        
        return orderRepository.save(order);
    }

    /**
     * Cancel an order
     */
    @Transactional
    public Order cancelOrder(String orderId, String reason) {
        Order order = getOrderByOrderId(orderId);
        
        // Check if order can be cancelled
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }
        
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelledDate(LocalDateTime.now());
        order.setCancellationReason(reason);
        
        return orderRepository.save(order);
    }

    /**
     * Get orders by status
     */
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    /**
     * Get orders by date range
     */
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }

    /**
     * Get recent orders (last 30 days)
     */
    public List<Order> getRecentOrders() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return orderRepository.findRecentOrders(thirtyDaysAgo);
    }

    /**
     * Validate status transition
     */
    private void validateStatusTransition(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        if (currentStatus == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot update status of a cancelled order");
        }
        
        if (currentStatus == Order.OrderStatus.DELIVERED && newStatus != Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot change status of a delivered order");
        }
    }

    /**
     * Update order details
     */
    @Transactional
    public Order updateOrderDetails(String orderId, Order updatedOrderDetails) {
        Order existingOrder = getOrderByOrderId(orderId);
        
        // Validate that the order can be updated
        if (existingOrder.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot update a delivered order");
        }
        
        if (existingOrder.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot update a cancelled order");
        }
        
        // Update allowed fields
        if (updatedOrderDetails.getCustomerName() != null) {
            existingOrder.setCustomerName(updatedOrderDetails.getCustomerName());
        }
        
        if (updatedOrderDetails.getCustomerEmail() != null) {
            existingOrder.setCustomerEmail(updatedOrderDetails.getCustomerEmail());
        }
        
        if (updatedOrderDetails.getShippingAddress() != null) {
            existingOrder.setShippingAddress(updatedOrderDetails.getShippingAddress());
        }
        
        if (updatedOrderDetails.getItems() != null && !updatedOrderDetails.getItems().isEmpty()) {
            existingOrder.setItems(updatedOrderDetails.getItems());
        }
        
        if (updatedOrderDetails.getTotalAmount() != null) {
            existingOrder.setTotalAmount(updatedOrderDetails.getTotalAmount());
        }
        
        if (updatedOrderDetails.getNotes() != null) {
            existingOrder.setNotes(updatedOrderDetails.getNotes());
        }
        
        return orderRepository.save(existingOrder);
    }

    /**
     * Delete order (admin only)
     */
    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

