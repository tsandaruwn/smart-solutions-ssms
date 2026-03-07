package com.ssms.inventorymanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRequest {

    @NotBlank(message = "Warehouse name must not be blank")
    @Size(max = 100, message = "Warehouse name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 80, message = "City name must not exceed 80 characters")
    private String city;

    @Size(max = 80, message = "Country name must not exceed 80 characters")
    private String country;

    @Positive(message = "Manager user ID must be a positive number")
    private Long managerUserId;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String contactPhone;

    @PositiveOrZero(message = "Capacity must be zero or a positive number")
    private Integer capacity;

    private Boolean isActive;
}
