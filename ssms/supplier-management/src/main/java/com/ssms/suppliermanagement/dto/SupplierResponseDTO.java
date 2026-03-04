package com.ssms.suppliermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierResponseDTO {

    private Long supplierId;
    private String email;
    private String companyName;
    private String contactPerson;
    private String phone;
    private String address;
    private String city;
    private String country;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<ProductResponseDTO> products;
}
