package com.ssms.inventorymanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseResponse {

    private Long warehouseId;
    private String name;
    private String address;
    private String city;
    private String country;
    private Long managerUserId;
    private String contactPhone;
    private Integer capacity;
    private Boolean isActive;
}
