package com.ssms.inventorymanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Request DTO for creating or updating a {@code Warehouse}.
 *
 * <p>All user-supplied data is validated via Jakarta Bean Validation
 * before the service layer processes it.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRequest {

    /** Human-readable warehouse name (required, max 100 chars). */
    @NotBlank(message = "Warehouse name must not be blank")
    @Size(max = 100, message = "Warehouse name must not exceed 100 characters")
    private String name;

    /** Full street / postal address. */
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    /** City where the warehouse is located. */
    @Size(max = 80, message = "City name must not exceed 80 characters")
    private String city;

    /** Country where the warehouse is located. */
    @Size(max = 80, message = "Country name must not exceed 80 characters")
    private String country;

    /**
     * User-service ID of the manager responsible for this warehouse.
     * Optional — a warehouse may exist before a manager is assigned.
     */
    @Positive(message = "Manager user ID must be a positive number")
    private Long managerUserId;

    /** Contact phone number for the warehouse. */
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String contactPhone;

    /** Maximum stock capacity (in units). Must be positive if supplied. */
    @PositiveOrZero(message = "Capacity must be zero or a positive number")
    private Integer capacity;

    /** Whether the warehouse is active. Defaults to {@code true} when null. */
    private Boolean isActive;
}
