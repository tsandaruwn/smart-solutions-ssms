package com.ssms.billinginvoice.dto;

import lombok.Data;

/**
 * Mirrors the ApiResponse wrapper returned by customer-service.
 * Shape: { "success": true, "message": "...", "data": { CustomerDto } }
 */
@Data
public class CustomerApiResponse {
    private boolean success;
    private String message;
    private CustomerDto data;
}
