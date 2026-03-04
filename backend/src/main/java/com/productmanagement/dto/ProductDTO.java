package com.productmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    
    private Long id;
    
    @NotBlank
    @Size(max = 60)
    private String sku;

    @NotBlank
    @Size(max = 150)
    private String name;
    
    @NotNull
    private Long categoryId;

    private String categoryName;

    @NotNull
    private Long supplierId;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;
    
    @Size(max = 1000)
    private String description;

    @Size(max = 255)
    private String imageUrl;
    
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime discontinuedAt;
}
