package com.ssms.installationmanagement.dto;

import com.ssms.installationmanagement.entity.AvailabilityStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Certification number is required")
    private String certificationNumber;

    @NotNull(message = "Availability status is required")
    private AvailabilityStatus availabilityStatus;

    private String phone;

    @NotNull(message = "Hired date is required")
    private LocalDate hiredDate;

    @NotNull(message = "Is active is required")
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
