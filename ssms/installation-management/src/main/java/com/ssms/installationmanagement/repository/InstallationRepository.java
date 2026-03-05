package com.ssms.installationmanagement.repository;

import com.ssms.installationmanagement.entity.Installation;
import com.ssms.installationmanagement.entity.InstallationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {

    Optional<Installation> findByJobReference(String jobReference);
    List<Installation> findByStatus(InstallationStatus status);
    List<Installation> findByTechnicianId(Long technicianId);
    List<Installation> findByCustomerId(Long customerId);
    List<Installation> findByOrderId(Long orderId);
    List<Installation> findByScheduledDateBetween(LocalDateTime start, LocalDateTime end);
    List<Installation> findByIsDeletedFalse();
    List<Installation> findByStatusAndIsDeletedFalse(InstallationStatus status);
}
