package com.ssms.inventorymanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration for the Inventory Management microservice.
 *
 * <p><strong>Current state (development):</strong> All API endpoints are open
 * to allow integration and testing before login is wired in.
 *
 * <p><strong>TODO — Login integration:</strong> Once the User Management service
 * exposes a JWT-based authentication mechanism, replace the permissive rule below
 * with JWT filter chain configuration and restrict endpoints to authenticated,
 * authorised roles (e.g. {@code MANAGER}, {@code EMPLOYEE}).
 *
 * <p>CSRF is disabled because this is a stateless REST API.
 * Sessions are set to {@code STATELESS} to prevent server-side session creation.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Endpoints accessible without authentication (Swagger UI, actuator, API docs).
     */
    private static final String[] PUBLIC_ENDPOINTS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/actuator/**"
    };

    /**
     * Configures the HTTP security filter chain.
     *
     * <p>All requests are currently permitted.
     * Authentication will be enforced after JWT integration is complete.
     *
     * @param http the {@link HttpSecurity} builder provided by Spring Security
     * @return the built {@link SecurityFilterChain}
     * @throws Exception if any configuration step fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Stateless REST API — no CSRF needed
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless session — no HTTP session will be created
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Always allow Swagger / Actuator
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // TODO: restrict to authenticated roles after JWT integration
                        // .requestMatchers(HttpMethod.GET).hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")
                        // .anyRequest().hasAnyRole("ADMIN", "MANAGER")

                        // Temporarily allow all requests (pre-login integration phase)
                        .anyRequest().permitAll()
                )
                .build();
    }
}
