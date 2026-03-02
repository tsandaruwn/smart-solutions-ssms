package com.ssms.installationmanagement.service.impl;

import com.ssms.installationmanagement.dto.InstallationDTO;
import com.ssms.installationmanagement.dto.StatusUpdateDTO;
import com.ssms.installationmanagement.dto.TechnicianAssignmentDTO;
import com.ssms.installationmanagement.entity.Installation;
import com.ssms.installationmanagement.entity.InstallationStatus;
import com.ssms.installationmanagement.exception.ResourceNotFoundException;
import com.ssms.installationmanagement.repository.InstallationRepository;
import com.ssms.installationmanagement.service.InstallationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InstallationServiceImpl implements InstallationService {

    private final InstallationRepository installationRepository;

    @Override
    public InstallationDTO scheduleInstallation(InstallationDTO installationDTO) {
        log.info("Scheduling new installation for customer: {}", installationDTO.getCustomerName());
        Installation installation = mapToEntity(installationDTO);
        installation.setStatus(InstallationStatus.SCHEDULED);
        Installation savedInstallation = installationRepository.save(installation);
        return mapToDTO(savedInstallation);
    }

    @Override
    public InstallationDTO assignTechnician(Long installationId, TechnicianAssignmentDTO assignmentDTO) {
        Installation installation = getInstallationEntity(installationId);
        installation.setTechnicianId(assignmentDTO.getTechnicianId());
        installation.setTechnicianName(assignmentDTO.getTechnicianName());
        return mapToDTO(installationRepository.save(installation));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstallationDTO> getAllInstallations() {
        return installationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InstallationDTO getInstallationById(Long id) {
        return mapToDTO(getInstallationEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstallationDTO> getInstallationsByStatus(InstallationStatus status) {
        return installationRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstallationDTO> getInstallationsByTechnician(Long technicianId) {
        return installationRepository.findByTechnicianId(technicianId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InstallationDTO updateInstallationStatus(Long id, StatusUpdateDTO statusUpdateDTO) {
        Installation installation = getInstallationEntity(id);
        installation.setStatus(statusUpdateDTO.getStatus());
        if (statusUpdateDTO.getNotes() != null) {
            installation.setNotes(statusUpdateDTO.getNotes());
        }
        return mapToDTO(installationRepository.save(installation));
    }

    @Override
    public InstallationDTO cancelInstallation(Long id) {
        Installation installation = getInstallationEntity(id);
        installation.setStatus(InstallationStatus.CANCELLED);
        return mapToDTO(installationRepository.save(installation));
    }

    @Override
    public void deleteInstallation(Long id) {
        Installation installation = getInstallationEntity(id);
        if (installation.getStatus() != InstallationStatus.COMPLETED &&
                installation.getStatus() != InstallationStatus.CANCELLED) {
            throw new IllegalStateException("Can only delete completed or cancelled installations");
        }
        installationRepository.delete(installation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstallationDTO> getInstallationsByDateRange(LocalDateTime start, LocalDateTime end) {
        return installationRepository.findByScheduledDateBetween(start, end).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Installation getInstallationEntity(Long id) {
        return installationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Installation not found with ID: " + id));
    }

    private InstallationDTO mapToDTO(Installation installation) {
        InstallationDTO dto = new InstallationDTO();
        dto.setId(installation.getId());
        dto.setCustomerId(installation.getCustomerId());
        dto.setProductId(installation.getProductId());
        dto.setCustomerName(installation.getCustomerName());
        dto.setProductName(installation.getProductName());
        dto.setInstallationAddress(installation.getInstallationAddress());
        dto.setScheduledDate(installation.getScheduledDate());
        dto.setTechnicianId(installation.getTechnicianId());
        dto.setTechnicianName(installation.getTechnicianName());
        dto.setStatus(installation.getStatus());
        dto.setNotes(installation.getNotes());
        dto.setCreatedAt(installation.getCreatedAt());
        dto.setUpdatedAt(installation.getUpdatedAt());
        return dto;
    }

    private Installation mapToEntity(InstallationDTO dto) {
        Installation installation = new Installation();
        installation.setCustomerId(dto.getCustomerId());
        installation.setProductId(dto.getProductId());
        installation.setCustomerName(dto.getCustomerName());
        installation.setProductName(dto.getProductName());
        installation.setInstallationAddress(dto.getInstallationAddress());
        installation.setScheduledDate(dto.getScheduledDate());
        installation.setTechnicianId(dto.getTechnicianId());
        installation.setTechnicianName(dto.getTechnicianName());
        installation.setNotes(dto.getNotes());
        return installation;
    }
}