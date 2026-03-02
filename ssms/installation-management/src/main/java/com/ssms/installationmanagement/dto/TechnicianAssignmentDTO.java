package com.ssms.installationmanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianAssignmentDTO {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    @NotNull(message = "Technician name is required")
    private String technicianName;
}