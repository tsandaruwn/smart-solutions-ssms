package com.ssms.ordermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for cancelling an order.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelOrderRequest {

    private String cancellationReason;
}
