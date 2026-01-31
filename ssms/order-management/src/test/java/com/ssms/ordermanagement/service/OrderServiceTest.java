package com.ssms.ordermanagement.service;

import com.ssms.ordermanagement.entity.Order;
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
    private List<Order.OrderItem> orderItems;

    @BeforeEach
    void setUp() {
        // Create sample order items
        orderItems = new ArrayList<>();
        Order.OrderItem item1 = new Order.OrderItem();
        item1.setProductId(101L);
        item1.setProductName("Smart Thermostat");
        item1.setProductCategory("Climate Control");
        item1.setQuantity(2);
        item1.setUnitPrice(new BigDecimal("149.99"));
        item1.setSubtotal(new BigDecimal("299.98"));
        orderItems.add(item1);

        // Create sample order
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setOrderId("ORD-20260131-A1B2");
        sampleOrder.setCustomerId(1L);
        sampleOrder.setCustomerName("John Doe");
        sampleOrder.setCustomerEmail("john@example.com");
        sampleOrder.setShippingAddress("123 Main St, City, State 12345");
        sampleOrder.setItems(orderItems);
        sampleOrder.setTotalAmount(new BigDecimal("299.98"));
        sampleOrder.setStatus(Order.OrderStatus.PENDING);
        sampleOrder.setOrderDate(LocalDateTime.now());
        sampleOrder.setNotes("Test order");
    }

    @Test
    void testPlaceOrder_Success() {
        when(orderRepository.existsByOrderId(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.placeOrder(sampleOrder);

        assertThat(result).isNotNull();
        assertThat(result.getOrderId()).isNotNull();
        assertThat(result.getStatus()).isEqualTo(Order.OrderStatus.PENDING);
        assertThat(result.getOrderDate()).isNotNull();

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        Order result = orderService.getOrderById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getOrderId()).isEqualTo("ORD-20260131-A1B2");

        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    void testGetOrderById_NotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Order not found with id: 999");
    }

    @Test
    void testGetOrderByOrderId_Success() {
        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        Order result = orderService.getOrderByOrderId("ORD-20260131-A1B2");

        assertThat(result).isNotNull();
        assertThat(result.getOrderId()).isEqualTo("ORD-20260131-A1B2");

        verify(orderRepository, times(1)).findByOrderId("ORD-20260131-A1B2");
    }

    @Test
    void testGetOrderByOrderId_NotFound() {
        when(orderRepository.findByOrderId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderByOrderId("INVALID"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Order not found with orderId: INVALID");
    }

    @Test
    void testGetAllOrders() {
        List<Order> orders = Arrays.asList(sampleOrder);
        when(orderRepository.findAll()).thenReturn(orders);

        List<Order> result = orderService.getAllOrders();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOrderId()).isEqualTo("ORD-20260131-A1B2");

        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void testGetOrderHistory() {
        List<Order> orderHistory = Arrays.asList(sampleOrder);
        when(orderRepository.findByCustomerIdOrderByOrderDateDesc(1L))
                .thenReturn(orderHistory);

        List<Order> result = orderService.getOrderHistory(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCustomerId()).isEqualTo(1L);

        verify(orderRepository, times(1)).findByCustomerIdOrderByOrderDateDesc(1L);
    }

    @Test
    void testUpdateOrderDetails_Success() {
        Order updateData = new Order();
        updateData.setCustomerName("Jane Smith");
        updateData.setShippingAddress("456 New Address");
        updateData.setNotes("Updated notes");

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.updateOrderDetails("ORD-20260131-A1B2", updateData);

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testUpdateOrderDetails_CannotUpdateDelivered() {
        sampleOrder.setStatus(Order.OrderStatus.DELIVERED);
        Order updateData = new Order();
        updateData.setCustomerName("Jane Smith");

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> 
                orderService.updateOrderDetails("ORD-20260131-A1B2", updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot update a delivered order");
    }

    @Test
    void testUpdateOrderDetails_CannotUpdateCancelled() {
        sampleOrder.setStatus(Order.OrderStatus.CANCELLED);
        Order updateData = new Order();
        updateData.setCustomerName("Jane Smith");

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> 
                orderService.updateOrderDetails("ORD-20260131-A1B2", updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot update a cancelled order");
    }

    @Test
    void testUpdateOrderStatus_ToShipped() {
        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.updateOrderStatus("ORD-20260131-A1B2", 
                Order.OrderStatus.SHIPPED);

        assertThat(result.getStatus()).isEqualTo(Order.OrderStatus.SHIPPED);
        assertThat(result.getShippedDate()).isNotNull();

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testUpdateOrderStatus_ToDelivered() {
        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.updateOrderStatus("ORD-20260131-A1B2", 
                Order.OrderStatus.DELIVERED);

        assertThat(result.getStatus()).isEqualTo(Order.OrderStatus.DELIVERED);
        assertThat(result.getDeliveredDate()).isNotNull();

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testUpdateOrderStatus_CannotUpdateCancelled() {
        sampleOrder.setStatus(Order.OrderStatus.CANCELLED);

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> 
                orderService.updateOrderStatus("ORD-20260131-A1B2", Order.OrderStatus.SHIPPED))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot update status of a cancelled order");
    }

    @Test
    void testCancelOrder_Success() {
        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.cancelOrder("ORD-20260131-A1B2", "Customer request");

        assertThat(result.getStatus()).isEqualTo(Order.OrderStatus.CANCELLED);
        assertThat(result.getCancelledDate()).isNotNull();
        assertThat(result.getCancellationReason()).isEqualTo("Customer request");

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testCancelOrder_CannotCancelDelivered() {
        sampleOrder.setStatus(Order.OrderStatus.DELIVERED);

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> 
                orderService.cancelOrder("ORD-20260131-A1B2", "Too late"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot cancel a delivered order");
    }

    @Test
    void testCancelOrder_AlreadyCancelled() {
        sampleOrder.setStatus(Order.OrderStatus.CANCELLED);

        when(orderRepository.findByOrderId("ORD-20260131-A1B2"))
                .thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> 
                orderService.cancelOrder("ORD-20260131-A1B2", "Duplicate"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Order is already cancelled");
    }

    @Test
    void testGetOrdersByStatus() {
        List<Order> pendingOrders = Arrays.asList(sampleOrder);
        when(orderRepository.findByStatus(Order.OrderStatus.PENDING))
                .thenReturn(pendingOrders);

        List<Order> result = orderService.getOrdersByStatus(Order.OrderStatus.PENDING);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Order.OrderStatus.PENDING);

        verify(orderRepository, times(1)).findByStatus(Order.OrderStatus.PENDING);
    }

    @Test
    void testGetOrdersByDateRange() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        List<Order> orders = Arrays.asList(sampleOrder);

        when(orderRepository.findByOrderDateBetween(startDate, endDate))
                .thenReturn(orders);

        List<Order> result = orderService.getOrdersByDateRange(startDate, endDate);

        assertThat(result).hasSize(1);
        verify(orderRepository, times(1)).findByOrderDateBetween(startDate, endDate);
    }

    @Test
    void testGetRecentOrders() {
        List<Order> recentOrders = Arrays.asList(sampleOrder);
        when(orderRepository.findRecentOrders(any(LocalDateTime.class)))
                .thenReturn(recentOrders);

        List<Order> result = orderService.getRecentOrders();

        assertThat(result).hasSize(1);
        verify(orderRepository, times(1)).findRecentOrders(any(LocalDateTime.class));
    }

    @Test
    void testDeleteOrder() {
        doNothing().when(orderRepository).deleteById(1L);

        orderService.deleteOrder(1L);

        verify(orderRepository, times(1)).deleteById(1L);
    }
}
