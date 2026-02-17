package com.ssms.installationmanagement.controller;

import com.ssms.installationmanagement.dto.InstallationDTO;
import com.ssms.installationmanagement.dto.StatusUpdateDTO;
import com.ssms.installationmanagement.dto.TechnicianAssignmentDTO;
import com.ssms.installationmanagement.entity.InstallationStatus;
import com.ssms.installationmanagement.service.InstallationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/installations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InstallationController {

    private final InstallationService installationService;

    @PostMapping
    public ResponseEntity<InstallationDTO> scheduleInstallation(
            @Valid @RequestBody InstallationDTO installationDTO) {
        InstallationDTO created = installationService.scheduleInstallation(installationDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/assign-technician")
    public ResponseEntity<InstallationDTO> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody TechnicianAssignmentDTO assignmentDTO) {
        InstallationDTO updated = installationService.assignTechnician(id, assignmentDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<InstallationDTO>> getAllInstallations() {
        List<InstallationDTO> installations = installationService.getAllInstallations();
        return ResponseEntity.ok(installations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstallationDTO> getInstallationById(@PathVariable Long id) {
        InstallationDTO installation = installationService.getInstallationById(id);
        return ResponseEntity.ok(installation);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InstallationDTO>> getInstallationsByStatus(
            @PathVariable InstallationStatus status) {
        List<InstallationDTO> installations = installationService.getInstallationsByStatus(status);
        return ResponseEntity.ok(installations);
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<InstallationDTO>> getInstallationsByTechnician(
            @PathVariable Long technicianId) {
        List<InstallationDTO> installations = installationService.getInstallationsByTechnician(technicianId);
        return ResponseEntity.ok(installations);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<InstallationDTO>> getInstallationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<InstallationDTO> installations = installationService.getInstallationsByDateRange(start, end);
        return ResponseEntity.ok(installations);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InstallationDTO> updateInstallationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusUpdateDTO) {
        InstallationDTO updated = installationService.updateInstallationStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<InstallationDTO> cancelInstallation(@PathVariable Long id) {
        InstallationDTO cancelled = installationService.cancelInstallation(id);
        return ResponseEntity.ok(cancelled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstallation(@PathVariable Long id) {
        installationService.deleteInstallation(id);
        return ResponseEntity.noContent().build();
    }
}
