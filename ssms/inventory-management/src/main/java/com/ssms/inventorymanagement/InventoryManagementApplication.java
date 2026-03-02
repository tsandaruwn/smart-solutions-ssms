package com.ssms.inventorymanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Entry point for the Inventory Management microservice.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Track stock quantities per product and warehouse</li>
 *   <li>Update inventory on order placement</li>
 *   <li>Generate low-stock alerts</li>
 *   <li>Manage warehouse stock records</li>
 * </ul>
 *
 * <p>Database migrations are managed by Flyway.
 * Service-to-service communication is handled via OpenFeign.
 */
@SpringBootApplication
@EnableFeignClients
public class InventoryManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryManagementApplication.class, args);
    }
}
