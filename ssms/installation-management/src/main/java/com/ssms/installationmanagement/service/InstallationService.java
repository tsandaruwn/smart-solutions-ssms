package com.ssms.installationmanagement.service;

import com.ssms.installationmanagement.dto.InstallationDTO;
import com.ssms.installationmanagement.dto.StatusUpdateDTO;
import com.ssms.installationmanagement.dto.TechnicianAssignmentDTO;
import com.ssms.installationmanagement.entity.InstallationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface InstallationService {

    InstallationDTO scheduleInstallation(InstallationDTO installationDTO);
    InstallationDTO assignTechnician(Long installationId, TechnicianAssignmentDTO assignmentDTO);
    List<InstallationDTO> getAllInstallations();
    InstallationDTO getInstallationById(Long id);
    List<InstallationDTO> getInstallationsByStatus(InstallationStatus status);
    List<InstallationDTO> getInstallationsByTechnician(Long technicianId);
    InstallationDTO updateInstallationStatus(Long id, StatusUpdateDTO statusUpdateDTO);
    InstallationDTO cancelInstallation(Long id);
    void deleteInstallation(Long id);
    List<InstallationDTO> getInstallationsByDateRange(LocalDateTime start, LocalDateTime end);
}
