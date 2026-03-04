package com.ssms.installationmanagement.repository;

import com.ssms.installationmanagement.entity.Technician;
import com.ssms.installationmanagement.entity.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    Optional<Technician> findByUserId(Long userId);
    List<Technician> findBySpecialization(String specialization);
    List<Technician> findByAvailabilityStatus(AvailabilityStatus status);
    List<Technician> findByIsActive(Boolean isActive);
    Optional<Technician> findByCertificationNumber(String certificationNumber);
}
