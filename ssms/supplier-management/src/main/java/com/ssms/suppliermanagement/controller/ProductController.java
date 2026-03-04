package com.ssms.suppliermanagement.controller;

import com.ssms.suppliermanagement.dto.ApiResponse;
import com.ssms.suppliermanagement.dto.ProductRequestDTO;
import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Get all products
     * GET /api/v1/products
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    /**
     * Get all active products
     * GET /api/v1/products/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getAllActiveProducts() {
        List<ProductResponseDTO> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(ApiResponse.success("Active products retrieved successfully", products));
    }

    /**
     * Get product by ID
     * GET /api/v1/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    /**
     * Create a new product
     * POST /api/v1/products
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody ProductRequestDTO requestDTO) {
        ProductResponseDTO product = productService.createProduct(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    /**
     * Update a product
     * PUT /api/v1/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO requestDTO) {
        ProductResponseDTO product = productService.updateProduct(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    /**
     * Delete a product
     * DELETE /api/v1/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    /**
     * Search products by name
     * GET /api/v1/products/search?name=xyz
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> searchProducts(@RequestParam String name) {
        List<ProductResponseDTO> products = productService.searchProductsByName(name);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", products));
    }
}
