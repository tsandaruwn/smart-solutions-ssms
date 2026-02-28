package com.ssms.inventorymanagement.repository;

import com.ssms.inventorymanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Warehouse} entities.
 *
 * <p>Custom query methods follow the Spring Data naming convention so that
 * no manual JPQL or native SQL is required for common lookups.
 */
@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    /**
     * Returns all warehouses that are currently active.
     *
     * @return list of active warehouses (never {@code null})
     */
    List<Warehouse> findAllByIsActiveTrue();

    /**
     * Returns a warehouse by its primary key only if it is active.
     *
     * @param warehouseId the warehouse ID to look up
     * @return an {@link Optional} containing the warehouse, or empty
     */
    Optional<Warehouse> findByWarehouseIdAndIsActiveTrue(Long warehouseId);

    /**
     * Checks whether a warehouse with the given name already exists.
     *
     * @param name the warehouse name to check
     * @return {@code true} if a record with this name exists
     */
    boolean existsByName(String name);

    /**
     * Finds all warehouses managed by a specific user (cross-service reference).
     *
     * @param managerUserId the user ID of the manager
     * @return list of matching warehouses
     */
    List<Warehouse> findAllByManagerUserId(Long managerUserId);
}
