package com.ssms.ordermanagement.controller;

import com.ssms.ordermanagement.dto.*;
import com.ssms.ordermanagement.entity.OrderStatus;
import com.ssms.ordermanagement.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Order Management operations.
 *
 * Base path: /api/orders
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // ─── CREATE ─────────────────────────────────────────────────

    /**
     * Place a new order.
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse order = orderService.placeOrder(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order placed successfully");
        response.put("orderNumber", order.getOrderNumber());
        response.put("order", order);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ───────────────────────────────────────────────────

    /**
     * Get all orders.
     * GET /api/orders
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Get order by primary key (order_id).
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    /**
     * Get order by order_number.
     * GET /api/orders/number/{orderNumber}
     */
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    /**
     * Get order history for a customer.
     * GET /api/orders/customer/{customerId}/history
     */
    @GetMapping("/customer/{customerId}/history")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(@PathVariable Integer customerId) {
        return ResponseEntity.ok(orderService.getOrderHistory(customerId));
    }

    /**
     * Get orders by status.
     * GET /api/orders/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    /**
     * Get orders by date range.
     * GET /api/orders/date-range?startDate=...&endDate=...
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<OrderResponse>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getOrdersByDateRange(startDate, endDate));
    }

    /**
     * Get recent orders (last 30 days).
     * GET /api/orders/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<List<OrderResponse>> getRecentOrders() {
        return ResponseEntity.ok(orderService.getRecentOrders());
    }

    // ─── UPDATE ─────────────────────────────────────────────────

    /**
     * Update order status (Pending → Shipped → Delivered).
     * PUT /api/orders/{orderId}/status
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated to " + order.getStatus());
        response.put("order", order);

        return ResponseEntity.ok(response);
    }

    // ─── CANCEL ─────────────────────────────────────────────────

    /**
     * Cancel an order.
     * POST /api/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable Integer orderId,
            @RequestBody(required = false) CancelOrderRequest request) {
        if (request == null) {
            request = new CancelOrderRequest();
        }
        OrderResponse order = orderService.cancelOrder(orderId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order cancelled successfully");
        response.put("order", order);

        return ResponseEntity.ok(response);
    }

    // ─── DELETE ─────────────────────────────────────────────────

    /**
     * Delete an order (admin).
     * DELETE /api/orders/{orderId}
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable Integer orderId) {
        orderService.deleteOrder(orderId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ─── HEALTH ─────────────────────────────────────────────────

    /**
     * Health check.
     * GET /api/orders/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Order Management Microservice");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}

