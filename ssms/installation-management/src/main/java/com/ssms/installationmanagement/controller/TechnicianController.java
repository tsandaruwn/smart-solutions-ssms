package com.ssms.installationmanagement.controller;

import com.ssms.installationmanagement.dto.TechnicianDTO;
import com.ssms.installationmanagement.entity.Technician;
import com.ssms.installationmanagement.repository.TechnicianRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "*")
public class TechnicianController {

    private final TechnicianRepository technicianRepository;

    public TechnicianController(TechnicianRepository technicianRepository) {
        this.technicianRepository = technicianRepository;
    }

    @GetMapping
    public ResponseEntity<List<TechnicianDTO>> getAll() {
        List<TechnicianDTO> technicians = technicianRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/active")
    public ResponseEntity<List<TechnicianDTO>> getActive() {
        List<TechnicianDTO> technicians = technicianRepository.findByIsActive(true)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnicianDTO> getById(@PathVariable Long id) {
        return technicianRepository.findById(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private TechnicianDTO toDTO(Technician t) {
        TechnicianDTO dto = new TechnicianDTO();
        dto.setId(t.getId());
        dto.setUserId(t.getUserId());
        dto.setSpecialization(t.getSpecialization());
        dto.setCertificationNumber(t.getCertificationNumber());
        dto.setAvailabilityStatus(t.getAvailabilityStatus());
        dto.setPhone(t.getPhone());
        dto.setHiredDate(t.getHiredDate());
        dto.setIsActive(t.getIsActive());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
