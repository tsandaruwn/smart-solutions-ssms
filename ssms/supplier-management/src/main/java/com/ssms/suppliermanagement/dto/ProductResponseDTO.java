package com.ssms.suppliermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {

    private Long productId;
    private String productName;
    private String description;
    private Double unitPrice;
    private Integer quantityInStock;
    private Long supplierId;
    private String supplierName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
