package com.ssms.billinginvoice.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CustomerDto {
    private Long customerId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private LocalDate dateOfBirth;
    private LocalDateTime registrationDate;
}
