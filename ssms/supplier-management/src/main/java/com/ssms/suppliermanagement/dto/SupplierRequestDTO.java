package com.ssms.suppliermanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person name cannot exceed 100 characters")
    private String contactPerson;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;

    private String address;

    @Size(max = 80, message = "City name cannot exceed 80 characters")
    private String city;

    @Size(max = 80, message = "Country name cannot exceed 80 characters")
    private String country;

    private LocalDate contractStartDate;

    private LocalDate contractEndDate;

    private Boolean isActive;
}
