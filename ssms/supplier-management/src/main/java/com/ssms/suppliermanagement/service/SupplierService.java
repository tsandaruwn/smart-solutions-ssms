package com.ssms.suppliermanagement.service;

import com.ssms.suppliermanagement.entity.Supplier;
import com.ssms.suppliermanagement.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);
        supplier.setName(supplierDetails.getName());
        supplier.setContact(supplierDetails.getContact());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setProductIds(supplierDetails.getProductIds());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }

    public List<Long> getSupplierProducts(Long id) {
        Supplier supplier = getSupplierById(id);
        return supplier.getProductIds();
    }

    public Supplier addProductToSupplier(Long supplierId, Long productId) {
        Supplier supplier = getSupplierById(supplierId);
        supplier.getProductIds().add(productId);
        return supplierRepository.save(supplier);
    }
}
