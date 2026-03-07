package com.ssms.suppliermanagement.controller;

import com.ssms.suppliermanagement.dto.ApiResponse;
import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.dto.SupplierRequestDTO;
import com.ssms.suppliermanagement.dto.SupplierResponseDTO;
import com.ssms.suppliermanagement.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> getAllSuppliers() {
        List<SupplierResponseDTO> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved successfully", suppliers));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> getAllActiveSuppliers() {
        List<SupplierResponseDTO> suppliers = supplierService.getAllActiveSuppliers();
        return ResponseEntity.ok(ApiResponse.success("Active suppliers retrieved successfully", suppliers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> getSupplierById(@PathVariable Long id) {
        SupplierResponseDTO supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier retrieved successfully", supplier));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> createSupplier(
            @Valid @RequestBody SupplierRequestDTO requestDTO) {
        SupplierResponseDTO supplier = supplierService.createSupplier(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplier created successfully", supplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequestDTO requestDTO) {
        SupplierResponseDTO supplier = supplierService.updateSupplier(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Supplier updated successfully", supplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deleted successfully", null));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteSupplier(@PathVariable Long id) {
        supplierService.hardDeleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier permanently deleted", null));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getSupplierProducts(@PathVariable Long id) {
        List<ProductResponseDTO> products = supplierService.getSupplierProducts(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier products retrieved successfully", products));
    }

    @GetMapping("/{id}/products/active")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getSupplierActiveProducts(@PathVariable Long id) {
        List<ProductResponseDTO> products = supplierService.getSupplierActiveProducts(id);
        return ResponseEntity.ok(ApiResponse.success("Active products retrieved successfully", products));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> searchSuppliers(
            @RequestParam String companyName) {
        List<SupplierResponseDTO> suppliers = supplierService.searchSuppliersByCompanyName(companyName);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", suppliers));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> getSuppliersByCity(@PathVariable String city) {
        List<SupplierResponseDTO> suppliers = supplierService.getSuppliersByCity(city);
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved successfully", suppliers));
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> getSuppliersByCountry(@PathVariable String country) {
        List<SupplierResponseDTO> suppliers = supplierService.getSuppliersByCountry(country);
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved successfully", suppliers));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> activateSupplier(@PathVariable Long id) {
        SupplierResponseDTO supplier = supplierService.activateSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier activated successfully", supplier));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> deactivateSupplier(@PathVariable Long id) {
        SupplierResponseDTO supplier = supplierService.deactivateSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deactivated successfully", supplier));
    }
}
