package com.ssms.inventorymanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8084}")
    private String serverPort;

    @Bean
    public OpenAPI inventoryManagementOpenAPI() {

        Server localServer = new Server()
                .url("http://localhost:" + serverPort)
                .description("Local development server");

        Contact contact = new Contact()
                .name("SSMS Development Team")
                .email("dev@ssms.com");

        Info info = new Info()
                .title("Inventory Management Service API")
                .version("1.0.0")
                .description("""
                        REST API for the **Inventory Management** microservice of the Smart Solutions Management System.

                        **Core features:**
                        - Track stock quantities per product per warehouse
                        - Update inventory on order placement
                        - Generate and query low-stock alerts
                        - Manage warehouse stock records (full CRUD)
                        - Soft-delete inventory records with full audit trail

                        **Flyway** manages all schema migrations.
                        **PostgreSQL** is the backing data store.
                        """)
                .contact(contact)
                .license(new License().name("Proprietary").url("https://ssms.com"));

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}
