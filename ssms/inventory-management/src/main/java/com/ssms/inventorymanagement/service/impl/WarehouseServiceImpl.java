package com.ssms.inventorymanagement.service.impl;

import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.entity.Warehouse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
import com.ssms.inventorymanagement.repository.WarehouseRepository;
import com.ssms.inventorymanagement.service.WarehouseService;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        log.info("Creating warehouse with name: {}", request.getName());

        if (warehouseRepository.existsByName(request.getName())) {
            throw new BusinessException(
                    ResponseMessages.WAREHOUSE_NAME_EXISTS + request.getName());
        }

        Warehouse warehouse = mapToEntity(request);
        Warehouse saved = warehouseRepository.save(warehouse);

        log.info("Warehouse created with ID: {}", saved.getWarehouseId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseResponse> getAllWarehouses() {
        log.debug("Fetching all active warehouses");
        return warehouseRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseResponse getWarehouseById(Long warehouseId) {
        log.debug("Fetching warehouse with ID: {}", warehouseId);
        Warehouse warehouse = findActiveOrThrow(warehouseId);
        return mapToResponse(warehouse);
    }

    @Override
    @Transactional
    public WarehouseResponse updateWarehouse(Long warehouseId, WarehouseRequest request) {
        log.info("Updating warehouse with ID: {}", warehouseId);

        Warehouse warehouse = findActiveOrThrow(warehouseId);

        if (!warehouse.getName().equals(request.getName())
                && warehouseRepository.existsByName(request.getName())) {
            throw new BusinessException(
                    ResponseMessages.WAREHOUSE_NAME_EXISTS + request.getName());
        }

        updateEntityFromRequest(warehouse, request);
        Warehouse updated = warehouseRepository.save(warehouse);

        log.info("Warehouse updated: {}", warehouseId);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deactivateWarehouse(Long warehouseId) {
        log.info("Deactivating warehouse with ID: {}", warehouseId);

        Warehouse warehouse = findActiveOrThrow(warehouseId);
        warehouse.setIsActive(Boolean.FALSE);
        warehouseRepository.save(warehouse);

        log.info("Warehouse deactivated: {}", warehouseId);
    }

    private Warehouse findActiveOrThrow(Long warehouseId) {
        return warehouseRepository
                .findByWarehouseIdAndIsActiveTrue(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ResponseMessages.WAREHOUSE_NOT_FOUND + warehouseId));
    }

    private Warehouse mapToEntity(WarehouseRequest request) {
        return Warehouse.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .managerUserId(request.getManagerUserId())
                .contactPhone(request.getContactPhone())
                .capacity(request.getCapacity())
                .isActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE)
                .build();
    }

    private void updateEntityFromRequest(Warehouse warehouse, WarehouseRequest request) {
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setCity(request.getCity());
        warehouse.setCountry(request.getCountry());
        warehouse.setManagerUserId(request.getManagerUserId());
        warehouse.setContactPhone(request.getContactPhone());
        warehouse.setCapacity(request.getCapacity());
        if (request.getIsActive() != null) {
            warehouse.setIsActive(request.getIsActive());
        }
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .warehouseId(warehouse.getWarehouseId())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .city(warehouse.getCity())
                .country(warehouse.getCountry())
                .managerUserId(warehouse.getManagerUserId())
                .contactPhone(warehouse.getContactPhone())
                .capacity(warehouse.getCapacity())
                .isActive(warehouse.getIsActive())
                .build();
    }
}
