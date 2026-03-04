package com.ssms.suppliermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - can be accessed without authentication
                .requestMatchers(HttpMethod.GET, "/api/v1/suppliers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                
                // Secured endpoints - require authentication (can be configured later)
                .requestMatchers(HttpMethod.POST, "/api/v1/suppliers/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/suppliers/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/suppliers/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/suppliers/**").permitAll()
                
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").permitAll()
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
