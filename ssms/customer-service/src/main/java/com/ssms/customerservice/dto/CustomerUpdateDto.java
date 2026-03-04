package com.ssms.customerservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerUpdateDto {

    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 80, message = "First name must not exceed 80 characters")
    private String firstName;

    @Size(max = 80, message = "Last name must not exceed 80 characters")
    private String lastName;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Size(max = 80, message = "City must not exceed 80 characters")
    private String city;

    @Size(max = 80, message = "State must not exceed 80 characters")
    private String state;

    @Size(max = 80, message = "Country must not exceed 80 characters")
    private String country;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
}
