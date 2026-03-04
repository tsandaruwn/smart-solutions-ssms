package com.ssms.suppliermanagement.util;

import com.ssms.suppliermanagement.dto.ProductRequestDTO;
import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.entity.Product;
import com.ssms.suppliermanagement.entity.Supplier;

import java.util.List;
import java.util.stream.Collectors;

public class ProductMapper {

    public static Product toEntity(ProductRequestDTO requestDTO, Supplier supplier) {
        Product product = new Product();
        product.setProductName(requestDTO.getProductName());
        product.setDescription(requestDTO.getDescription());
        product.setUnitPrice(requestDTO.getUnitPrice());
        product.setQuantityInStock(requestDTO.getQuantityInStock());
        product.setSupplier(supplier);
        product.setIsActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : true);
        return product;
    }

    public static ProductResponseDTO toResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .unitPrice(product.getUnitPrice())
                .quantityInStock(product.getQuantityInStock())
                .supplierId(product.getSupplier() != null ? product.getSupplier().getSupplierId() : null)
                .supplierName(product.getSupplier() != null ? product.getSupplier().getCompanyName() : null)
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }

    public static List<ProductResponseDTO> toResponseDTOList(List<Product> products) {
        return products.stream()
                .map(ProductMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public static void updateEntity(Product product, ProductRequestDTO requestDTO) {
        product.setProductName(requestDTO.getProductName());
        product.setDescription(requestDTO.getDescription());
        product.setUnitPrice(requestDTO.getUnitPrice());
        product.setQuantityInStock(requestDTO.getQuantityInStock());
        if (requestDTO.getIsActive() != null) {
            product.setIsActive(requestDTO.getIsActive());
        }
    }
}
