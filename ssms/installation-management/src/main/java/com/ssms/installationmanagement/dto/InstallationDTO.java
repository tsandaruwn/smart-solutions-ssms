package com.ssms.installationmanagement.dto;

import com.ssms.installationmanagement.entity.InstallationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstallationDTO {

    private Long id;

    @NotBlank(message = "Job reference is required")
    private String jobReference;

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    private Long scheduledByUserId;

    @NotNull(message = "Scheduled date is required")
    private LocalDateTime scheduledDate;

    private LocalDateTime completedDate;

    @NotBlank(message = "Installation address is required")
    private String installationAddress;

    @NotNull(message = "Status is required")
    private InstallationStatus status;

    private String technicianNotes;
    private String cancellationReason;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
