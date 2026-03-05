package com.ssms.suppliermanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDTO {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String description;

    @Positive(message = "Unit price must be positive")
    private Double unitPrice;

    @PositiveOrZero(message = "Quantity must be zero or positive")
    private Integer quantityInStock;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private Boolean isActive;
}
