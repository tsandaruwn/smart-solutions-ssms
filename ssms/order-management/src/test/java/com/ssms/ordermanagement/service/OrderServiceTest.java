package com.ssms.ordermanagement.service;

import com.ssms.ordermanagement.dto.*;
import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.entity.OrderItem;
import com.ssms.ordermanagement.entity.OrderStatus;
import com.ssms.ordermanagement.exception.InvalidOrderStateException;
import com.ssms.ordermanagement.exception.OrderNotFoundException;
import com.ssms.ordermanagement.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;
    private CreateOrderRequest createRequest;

    @BeforeEach
    void setUp() {
        // Build a sample Order entity (as returned from DB)
        OrderItem item = OrderItem.builder()
                .orderItemId(1)
                .productId(101)
                .quantity(2)
                .unitPriceAtOrder(new BigDecimal("149.99"))
                .discountPercent(BigDecimal.ZERO)
                .build();

        sampleOrder = Order.builder()
                .orderId(1)
                .orderNumber("ORD-20260228-A1B2")
                .customerId(1)
                .createdByUserId(1)
                .shippingAddress("123 Main St, City, State 12345")
                .shippingCity("Colombo")
                .totalAmount(new BigDecimal("299.98"))
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .notes("Test order")
                .items(new ArrayList<>())
                .build();
        sampleOrder.addItem(item);

        // Build a CreateOrderRequest
        OrderItemRequest itemReq = OrderItemRequest.builder()
                .productId(101)
                .quantity(2)
                .unitPriceAtOrder(new BigDecimal("149.99"))
                .discountPercent(BigDecimal.ZERO)
                .build();

        createRequest = CreateOrderRequest.builder()
                .customerId(1)
                .createdByUserId(1)
                .shippingAddress("123 Main St, City, State 12345")
                .shippingCity("Colombo")
                .notes("Test order")
                .items(List.of(itemReq))
                .build();
    }

    // ─── Place Order ────────────────────────────────────────────

    @Test
    void testPlaceOrder_Success() {
        when(orderRepository.existsByOrderNumber(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        OrderResponse result = orderService.placeOrder(createRequest);

        assertThat(result).isNotNull();
        assertThat(result.getOrderNumber()).isNotNull();
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    // ─── Get Order ──────────────────────────────────────────────

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        OrderResponse result = orderService.getOrderById(1);

        assertThat(result).isNotNull();
        assertThat(result.getOrderId()).isEqualTo(1);
        assertThat(result.getOrderNumber()).isEqualTo("ORD-20260228-A1B2");
        verify(orderRepository, times(1)).findById(1);
    }

    @Test
    void testGetOrderById_NotFound() {
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(999))
                .isInstanceOf(OrderNotFoundException.class)
                .hasMessageContaining("Order not found with id: 999");
    }

    @Test
    void testGetOrderByOrderNumber_Success() {
        when(orderRepository.findByOrderNumber("ORD-20260228-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        OrderResponse result = orderService.getOrderByOrderNumber("ORD-20260228-A1B2");

        assertThat(result).isNotNull();
        assertThat(result.getOrderNumber()).isEqualTo("ORD-20260228-A1B2");
    }

    @Test
    void testGetOrderByOrderNumber_NotFound() {
        when(orderRepository.findByOrderNumber("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderByOrderNumber("INVALID"))
                .isInstanceOf(OrderNotFoundException.class)
                .hasMessageContaining("Order not found with order number: INVALID");
    }

    @Test
    void testGetAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(sampleOrder));

        List<OrderResponse> result = orderService.getAllOrders();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOrderNumber()).isEqualTo("ORD-20260228-A1B2");
    }

    @Test
    void testGetOrderHistory() {
        when(orderRepository.findByCustomerIdOrderByOrderDateDesc(1))
                .thenReturn(List.of(sampleOrder));

        List<OrderResponse> result = orderService.getOrderHistory(1);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCustomerId()).isEqualTo(1);
    }

    // ─── Update Status ──────────────────────────────────────────

    @Test
    void testUpdateOrderStatus_PendingToShipped() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse result = orderService.updateOrderStatus(1,
                new UpdateOrderStatusRequest(OrderStatus.SHIPPED));

        assertThat(result.getStatus()).isEqualTo(OrderStatus.SHIPPED);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testUpdateOrderStatus_ShippedToDelivered() {
        sampleOrder.setStatus(OrderStatus.SHIPPED);
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse result = orderService.updateOrderStatus(1,
                new UpdateOrderStatusRequest(OrderStatus.DELIVERED));

        assertThat(result.getStatus()).isEqualTo(OrderStatus.DELIVERED);
    }

    @Test
    void testUpdateOrderStatus_InvalidTransition_PendingToDelivered() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1,
                new UpdateOrderStatusRequest(OrderStatus.DELIVERED)))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void testUpdateOrderStatus_CannotUpdateCancelled() {
        sampleOrder.setStatus(OrderStatus.CANCELLED);
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1,
                new UpdateOrderStatusRequest(OrderStatus.SHIPPED)))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Cannot update status of a cancelled order");
    }

    // ─── Cancel Order ───────────────────────────────────────────

    @Test
    void testCancelOrder_Success() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse result = orderService.cancelOrder(1,
                new CancelOrderRequest("Customer request"));

        assertThat(result.getStatus()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(result.getCancelledAt()).isNotNull();
        assertThat(result.getCancellationReason()).isEqualTo("Customer request");
    }

    @Test
    void testCancelOrder_CannotCancelDelivered() {
        sampleOrder.setStatus(OrderStatus.DELIVERED);
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.cancelOrder(1,
                new CancelOrderRequest("Too late")))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Cannot cancel a delivered order");
    }

    @Test
    void testCancelOrder_AlreadyCancelled() {
        sampleOrder.setStatus(OrderStatus.CANCELLED);
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.cancelOrder(1,
                new CancelOrderRequest("Duplicate")))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Order is already cancelled");
    }

    @Test
    void testCancelOrder_CannotCancelShipped() {
        sampleOrder.setStatus(OrderStatus.SHIPPED);
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.cancelOrder(1,
                new CancelOrderRequest("Changed mind")))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Cannot cancel a shipped order");
    }

    // ─── Filter queries ─────────────────────────────────────────

    @Test
    void testGetOrdersByStatus() {
        when(orderRepository.findByStatus(OrderStatus.PENDING))
                .thenReturn(List.of(sampleOrder));

        List<OrderResponse> result = orderService.getOrdersByStatus(OrderStatus.PENDING);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(OrderStatus.PENDING);
    }

    @Test
    void testGetOrdersByDateRange() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();

        when(orderRepository.findByOrderDateBetween(startDate, endDate))
                .thenReturn(List.of(sampleOrder));

        List<OrderResponse> result = orderService.getOrdersByDateRange(startDate, endDate);

        assertThat(result).hasSize(1);
    }

    @Test
    void testGetRecentOrders() {
        when(orderRepository.findRecentOrders(any(LocalDateTime.class)))
                .thenReturn(List.of(sampleOrder));

        List<OrderResponse> result = orderService.getRecentOrders();

        assertThat(result).hasSize(1);
    }

    // ─── Delete ─────────────────────────────────────────────────

    @Test
    void testDeleteOrder() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(sampleOrder));
        doNothing().when(orderRepository).delete(any(Order.class));

        orderService.deleteOrder(1);

        verify(orderRepository, times(1)).delete(any(Order.class));
    }

    @Test
    void testDeleteOrder_NotFound() {
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.deleteOrder(999))
                .isInstanceOf(OrderNotFoundException.class);
    }
}
