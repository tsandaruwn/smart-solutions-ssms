package com.ssms.inventorymanagement.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Explicit Flyway configuration to guarantee migrations run before Hibernate
 * initialises the EntityManagerFactory.
 *
 * <p>Spring Boot 4.x relocated the Flyway auto-configuration module; this
 * manual bean registration ensures Flyway executes reliably regardless of
 * auto-configuration ordering issues.
 *
 * <p>The bean name {@code "flyway"} matches what Spring Boot expects so that
 * the existing {@code FlywayMigrationInitializer} (if present) still works.
 */
@Configuration
public class FlywayConfig {

    @Value("${spring.flyway.table:flyway_schema_history_inventory}")
    private String historyTable;

    @Value("${spring.flyway.locations:classpath:db/migration}")
    private String locations;

    /**
     * Creates and immediately executes Flyway migrations.
     *
     * <p>Key settings:
     * <ul>
     *   <li>{@code table} — isolated per-service history table so multiple
     *       microservices can share the same {@code ssms} PostgreSQL database</li>
     *   <li>{@code baselineOnMigrate} — safe to run on a database that already
     *       has objects created outside Flyway</li>
     *   <li>{@code locations} — reads from the configured migration scripts path</li>
     * </ul>
     *
     * @param dataSource the application {@link DataSource} injected by Spring
     * @return the configured and migrated {@link Flyway} instance
     */
    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(locations)
                .table(historyTable)
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .validateOnMigrate(true)
                .load();
    }
}
