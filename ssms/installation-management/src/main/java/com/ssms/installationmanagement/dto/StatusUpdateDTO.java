package com.ssms.installationmanagement.dto;

import com.ssms.installationmanagement.entity.InstallationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {

    @NotNull(message = "Status is required")
    private InstallationStatus status;

    private String notes;
}
