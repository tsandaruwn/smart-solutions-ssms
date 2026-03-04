package com.ssms.suppliermanagement.util;

import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.dto.SupplierRequestDTO;
import com.ssms.suppliermanagement.dto.SupplierResponseDTO;
import com.ssms.suppliermanagement.entity.Product;
import com.ssms.suppliermanagement.entity.Supplier;

import java.util.List;
import java.util.stream.Collectors;

public class SupplierMapper {

    public static Supplier toEntity(SupplierRequestDTO requestDTO) {
        Supplier supplier = new Supplier();
        supplier.setEmail(requestDTO.getEmail());
        supplier.setCompanyName(requestDTO.getCompanyName());
        supplier.setContactPerson(requestDTO.getContactPerson());
        supplier.setPhone(requestDTO.getPhone());
        supplier.setAddress(requestDTO.getAddress());
        supplier.setCity(requestDTO.getCity());
        supplier.setCountry(requestDTO.getCountry());
        supplier.setContractStartDate(requestDTO.getContractStartDate());
        supplier.setContractEndDate(requestDTO.getContractEndDate());
        supplier.setIsActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : true);
        return supplier;
    }

    public static SupplierResponseDTO toResponseDTO(Supplier supplier) {
        return SupplierResponseDTO.builder()
                .supplierId(supplier.getSupplierId())
                .email(supplier.getEmail())
                .companyName(supplier.getCompanyName())
                .contactPerson(supplier.getContactPerson())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .city(supplier.getCity())
                .country(supplier.getCountry())
                .contractStartDate(supplier.getContractStartDate())
                .contractEndDate(supplier.getContractEndDate())
                .isActive(supplier.getIsActive())
                .createdAt(supplier.getCreatedAt())
                .products(mapProducts(supplier.getProducts()))
                .build();
    }

    public static List<SupplierResponseDTO> toResponseDTOList(List<Supplier> suppliers) {
        return suppliers.stream()
                .map(SupplierMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public static void updateEntity(Supplier supplier, SupplierRequestDTO requestDTO) {
        supplier.setEmail(requestDTO.getEmail());
        supplier.setCompanyName(requestDTO.getCompanyName());
        supplier.setContactPerson(requestDTO.getContactPerson());
        supplier.setPhone(requestDTO.getPhone());
        supplier.setAddress(requestDTO.getAddress());
        supplier.setCity(requestDTO.getCity());
        supplier.setCountry(requestDTO.getCountry());
        supplier.setContractStartDate(requestDTO.getContractStartDate());
        supplier.setContractEndDate(requestDTO.getContractEndDate());
        if (requestDTO.getIsActive() != null) {
            supplier.setIsActive(requestDTO.getIsActive());
        }
    }

    private static List<ProductResponseDTO> mapProducts(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return List.of();
        }
        return products.stream()
                .map(ProductMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
