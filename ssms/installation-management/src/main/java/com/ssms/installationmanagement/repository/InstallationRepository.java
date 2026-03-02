package com.ssms.installationmanagement.repository;

import com.ssms.installationmanagement.entity.Installation;
import com.ssms.installationmanagement.entity.InstallationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {

    List<Installation> findByStatus(InstallationStatus status);
    List<Installation> findByTechnicianId(Long technicianId);
    List<Installation> findByCustomerId(Long customerId);
    List<Installation> findByScheduledDateBetween(LocalDateTime start, LocalDateTime end);
}
