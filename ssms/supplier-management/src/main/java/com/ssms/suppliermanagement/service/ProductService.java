package com.ssms.suppliermanagement.service;

import com.ssms.suppliermanagement.dto.ProductRequestDTO;
import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.entity.Product;
import com.ssms.suppliermanagement.entity.Supplier;
import com.ssms.suppliermanagement.exception.DuplicateResourceException;
import com.ssms.suppliermanagement.exception.ResourceNotFoundException;
import com.ssms.suppliermanagement.repository.ProductRepository;
import com.ssms.suppliermanagement.repository.SupplierRepository;
import com.ssms.suppliermanagement.util.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public List<ProductResponseDTO> getAllProducts() {
        log.info("Fetching all products");
        List<Product> products = productRepository.findAll();
        return ProductMapper.toResponseDTOList(products);
    }

    public List<ProductResponseDTO> getAllActiveProducts() {
        log.info("Fetching all active products");
        List<Product> products = productRepository.findAllActiveProducts();
        return ProductMapper.toResponseDTOList(products);
    }

    public ProductResponseDTO getProductById(Long id) {
        log.info("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductMapper.toResponseDTO(product);
    }

    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {
        log.info("Creating new product: {}", requestDTO.getProductName());
        
        Supplier supplier = supplierRepository.findById(requestDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", requestDTO.getSupplierId()));
        
        if (productRepository.existsByProductNameAndSupplier_SupplierId(
                requestDTO.getProductName(), requestDTO.getSupplierId())) {
            throw new DuplicateResourceException("Product", "productName", requestDTO.getProductName());
        }
        
        Product product = ProductMapper.toEntity(requestDTO, supplier);
        Product savedProduct = productRepository.save(product);
        
        log.info("Product created successfully with id: {}", savedProduct.getProductId());
        return ProductMapper.toResponseDTO(savedProduct);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO requestDTO) {
        log.info("Updating product with id: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        if (!product.getProductName().equals(requestDTO.getProductName()) 
                && productRepository.existsByProductNameAndSupplier_SupplierId(
                        requestDTO.getProductName(), product.getSupplier().getSupplierId())) {
            throw new DuplicateResourceException("Product", "productName", requestDTO.getProductName());
        }
        
        ProductMapper.updateEntity(product, requestDTO);
        Product updatedProduct = productRepository.save(product);
        
        log.info("Product updated successfully with id: {}", id);
        return ProductMapper.toResponseDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        productRepository.delete(product);
        log.info("Product deleted successfully with id: {}", id);
    }

    public List<ProductResponseDTO> searchProductsByName(String productName) {
        log.info("Searching products by name: {}", productName);
        List<Product> products = productRepository.findByProductNameContainingIgnoreCase(productName);
        return ProductMapper.toResponseDTOList(products);
    }
}
