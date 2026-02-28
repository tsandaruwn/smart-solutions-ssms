package com.ssms.suppliermanagement.controller;

import com.ssms.suppliermanagement.entity.Supplier;
import com.ssms.suppliermanagement.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierService.createSupplier(supplier));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<Long>> getSupplierProducts(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierProducts(id));
    }

    @PostMapping("/{supplierId}/products/{productId}")
    public ResponseEntity<Supplier> addProductToSupplier(
            @PathVariable Long supplierId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                supplierService.addProductToSupplier(supplierId, productId));
    }
}
