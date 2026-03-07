package com.ssms.billinginvoice.dto;

import lombok.Data;

@Data
public class CustomerApiResponse {
    private boolean success;
    private String message;
    private CustomerDto data;
}
