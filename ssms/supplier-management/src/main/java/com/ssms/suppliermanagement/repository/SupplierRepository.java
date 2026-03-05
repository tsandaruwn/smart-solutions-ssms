package com.ssms.suppliermanagement.repository;

import com.ssms.suppliermanagement.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByEmail(String email);

    List<Supplier> findByCompanyNameContainingIgnoreCase(String companyName);

    boolean existsByEmail(String email);

    @Query("SELECT s FROM Supplier s WHERE s.isActive = true")
    List<Supplier> findAllActiveSuppliers();

    @Query("SELECT s FROM Supplier s WHERE s.city = :city AND s.isActive = true")
    List<Supplier> findActiveSuppliersByCity(String city);

    @Query("SELECT s FROM Supplier s WHERE s.country = :country AND s.isActive = true")
    List<Supplier> findActiveSuppliersByCountry(String country);
}
