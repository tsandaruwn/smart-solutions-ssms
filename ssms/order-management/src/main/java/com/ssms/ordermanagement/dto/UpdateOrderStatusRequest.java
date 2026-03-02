package com.ssms.ordermanagement.dto;

import com.ssms.ordermanagement.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating order status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull(message = "New status is required")
    private OrderStatus status;
}
