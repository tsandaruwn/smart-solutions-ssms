package com.productmanagement.service;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Category;
import com.productmanagement.model.Product;
import com.productmanagement.repository.CategoryRepository;
import com.productmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<ProductDTO> getAllProducts() {
        List<Product> allProducts = productRepository.findAll();
        List<ProductDTO> result = new ArrayList<>();
        for (Product product : allProducts) {
            result.add(convertToDTO(product));
        }
        return result;
    }
    
    public List<ProductDTO> getAvailableProducts() {
        List<Product> available = productRepository.findByIsActiveTrue();
        List<ProductDTO> result = new ArrayList<>();
        for (Product product : available) {
            result.add(convertToDTO(product));
        }
        return result;
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }
    
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));

        Product product = convertToEntity(productDTO, category);
        product.setIsActive(true);
        product.setDiscontinuedAt(null);
        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }
    
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));

        product.setSku(productDTO.getSku());
        product.setName(productDTO.getName());
        product.setCategory(category);
        product.setSupplierId(productDTO.getSupplierId());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setImageUrl(productDTO.getImageUrl());

        Product updated = productRepository.save(product);
        return convertToDTO(updated);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    public ProductDTO removeProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setIsActive(false);
        product.setDiscontinuedAt(LocalDateTime.now());
        Product updated = productRepository.save(product);
        return convertToDTO(updated);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setSupplierId(product.getSupplierId());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setImageUrl(product.getImageUrl());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setDiscontinuedAt(product.getDiscontinuedAt());
        return dto;
    }

    private Product convertToEntity(ProductDTO dto, Category category) {
        Product product = new Product();
        product.setSku(dto.getSku());
        product.setName(dto.getName());
        product.setCategory(category);
        product.setSupplierId(dto.getSupplierId());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        return product;
    }
}
