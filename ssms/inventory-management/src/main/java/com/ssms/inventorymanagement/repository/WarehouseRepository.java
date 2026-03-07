package com.ssms.inventorymanagement.repository;

import com.ssms.inventorymanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    List<Warehouse> findAllByIsActiveTrue();

    Optional<Warehouse> findByWarehouseIdAndIsActiveTrue(Long warehouseId);

    boolean existsByName(String name);

    List<Warehouse> findAllByManagerUserId(Long managerUserId);
}
