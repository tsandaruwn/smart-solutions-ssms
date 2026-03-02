package com.ssms.billinginvoice.dto;

public class CustomerDto {
    private Long customerId;
    private String name;
    private String email;

    public Long getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}