package com.ssms.inventorymanagement.repository;

import com.ssms.inventorymanagement.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Inventory} entities.
 *
 * <p>All queries exclude soft-deleted records unless explicitly stated.
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findAllByIsDeletedFalse();

    Optional<Inventory> findByInventoryIdAndIsDeletedFalse(Long inventoryId);

    List<Inventory> findAllByProductIdAndIsDeletedFalse(Long productId);

    List<Inventory> findAllByWarehouse_WarehouseIdAndIsDeletedFalse(Long warehouseId);

    Optional<Inventory> findByProductIdAndWarehouse_WarehouseIdAndIsDeletedFalse(
            Long productId, Long warehouseId);

    boolean existsByProductIdAndWarehouse_WarehouseId(Long productId, Long warehouseId);

    @Query("SELECT i FROM Inventory i WHERE i.isDeleted = false AND i.quantityOnHand <= i.reorderLevel")
    List<Inventory> findAllLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.isDeleted = false AND i.quantityOnHand <= i.reorderLevel AND i.lowStockAlertSent = false")
    List<Inventory> findAllPendingLowStockAlerts();

    @Query("SELECT i FROM Inventory i WHERE i.isDeleted = false AND i.warehouse.warehouseId = :warehouseId AND i.quantityOnHand <= i.reorderLevel")
    List<Inventory> findLowStockItemsByWarehouse(@Param("warehouseId") Long warehouseId);
}

