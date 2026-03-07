package com.ssms.suppliermanagement.service;

import com.ssms.suppliermanagement.dto.ProductResponseDTO;
import com.ssms.suppliermanagement.dto.SupplierRequestDTO;
import com.ssms.suppliermanagement.dto.SupplierResponseDTO;
import com.ssms.suppliermanagement.entity.Product;
import com.ssms.suppliermanagement.entity.Supplier;
import com.ssms.suppliermanagement.exception.DuplicateResourceException;
import com.ssms.suppliermanagement.exception.ResourceNotFoundException;
import com.ssms.suppliermanagement.repository.ProductRepository;
import com.ssms.suppliermanagement.repository.SupplierRepository;
import com.ssms.suppliermanagement.util.ProductMapper;
import com.ssms.suppliermanagement.util.SupplierMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public List<SupplierResponseDTO> getAllSuppliers() {
        log.info("Fetching all suppliers");
        List<Supplier> suppliers = supplierRepository.findAll();
        return SupplierMapper.toResponseDTOList(suppliers);
    }

    public List<SupplierResponseDTO> getAllActiveSuppliers() {
        log.info("Fetching all active suppliers");
        List<Supplier> suppliers = supplierRepository.findAllActiveSuppliers();
        return SupplierMapper.toResponseDTOList(suppliers);
    }

    public SupplierResponseDTO getSupplierById(Long id) {
        log.info("Fetching supplier with id: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return SupplierMapper.toResponseDTO(supplier);
    }

    public SupplierResponseDTO createSupplier(SupplierRequestDTO requestDTO) {
        log.info("Creating new supplier with email: {}", requestDTO.getEmail());
        
        if (supplierRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException("Supplier", "email", requestDTO.getEmail());
        }
        
        Supplier supplier = SupplierMapper.toEntity(requestDTO);
        Supplier savedSupplier = supplierRepository.save(supplier);
        
        log.info("Supplier created successfully with id: {}", savedSupplier.getSupplierId());
        return SupplierMapper.toResponseDTO(savedSupplier);
    }

    public SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO requestDTO) {
        log.info("Updating supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        if (!supplier.getEmail().equals(requestDTO.getEmail()) 
                && supplierRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException("Supplier", "email", requestDTO.getEmail());
        }
        
        SupplierMapper.updateEntity(supplier, requestDTO);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        
        log.info("Supplier updated successfully with id: {}", id);
        return SupplierMapper.toResponseDTO(updatedSupplier);
    }

    public void deleteSupplier(Long id) {
        log.info("Deleting supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        supplierRepository.delete(supplier);
        log.info("Supplier deleted successfully with id: {}", id);
    }

    public void hardDeleteSupplier(Long id) {
        log.info("Hard deleting supplier with id: {}", id);
        
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier", "id", id);
        }
        
        supplierRepository.deleteById(id);
        log.info("Supplier permanently deleted with id: {}", id);
    }

    public List<ProductResponseDTO> getSupplierProducts(Long supplierId) {
        log.info("Fetching products for supplier id: {}", supplierId);
        
        if (!supplierRepository.existsById(supplierId)) {
            throw new ResourceNotFoundException("Supplier", "id", supplierId);
        }
        
        List<Product> products = productRepository.findBySupplier_SupplierId(supplierId);
        return ProductMapper.toResponseDTOList(products);
    }

    public List<ProductResponseDTO> getSupplierActiveProducts(Long supplierId) {
        log.info("Fetching active products for supplier id: {}", supplierId);
        
        if (!supplierRepository.existsById(supplierId)) {
            throw new ResourceNotFoundException("Supplier", "id", supplierId);
        }
        
        List<Product> products = productRepository.findActiveProductsBySupplierId(supplierId);
        return ProductMapper.toResponseDTOList(products);
    }

    public List<SupplierResponseDTO> searchSuppliersByCompanyName(String companyName) {
        log.info("Searching suppliers by company name: {}", companyName);
        List<Supplier> suppliers = supplierRepository.findByCompanyNameContainingIgnoreCase(companyName);
        return SupplierMapper.toResponseDTOList(suppliers);
    }

    public List<SupplierResponseDTO> getSuppliersByCity(String city) {
        log.info("Fetching suppliers by city: {}", city);
        List<Supplier> suppliers = supplierRepository.findActiveSuppliersByCity(city);
        return SupplierMapper.toResponseDTOList(suppliers);
    }

    public List<SupplierResponseDTO> getSuppliersByCountry(String country) {
        log.info("Fetching suppliers by country: {}", country);
        List<Supplier> suppliers = supplierRepository.findActiveSuppliersByCountry(country);
        return SupplierMapper.toResponseDTOList(suppliers);
    }

    public SupplierResponseDTO activateSupplier(Long id) {
        log.info("Activating supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        supplier.setIsActive(true);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        
        log.info("Supplier activated successfully with id: {}", id);
        return SupplierMapper.toResponseDTO(updatedSupplier);
    }

    public SupplierResponseDTO deactivateSupplier(Long id) {
        log.info("Deactivating supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        supplier.setIsActive(false);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        
        log.info("Supplier deactivated successfully with id: {}", id);
        return SupplierMapper.toResponseDTO(updatedSupplier);
    }
}
