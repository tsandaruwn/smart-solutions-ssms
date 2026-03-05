package com.ssms.suppliermanagement.repository;

import com.ssms.suppliermanagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySupplier_SupplierId(Long supplierId);

    @Query("SELECT p FROM Product p WHERE p.supplier.supplierId = :supplierId AND p.isActive = true")
    List<Product> findActiveProductsBySupplierId(Long supplierId);

    List<Product> findByProductNameContainingIgnoreCase(String productName);

    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    List<Product> findAllActiveProducts();

    boolean existsByProductNameAndSupplier_SupplierId(String productName, Long supplierId);
}
