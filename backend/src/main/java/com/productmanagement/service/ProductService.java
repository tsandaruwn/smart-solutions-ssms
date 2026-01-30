package com.productmanagement.service;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getAvailableProducts() {
        return productRepository.findByDiscontinuedFalse()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }
    
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        product.setDiscontinued(false);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setName(productDTO.getName());
        product.setCategory(productDTO.getCategory());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        if (productDTO.getDiscontinued() != null) {
            product.setDiscontinued(productDTO.getDiscontinued());
        }
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }
    
    public ProductDTO removeProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setDiscontinued(true);
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setDiscontinued(product.getDiscontinued());
        return dto;
    }
    
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        return product;
    }
}

