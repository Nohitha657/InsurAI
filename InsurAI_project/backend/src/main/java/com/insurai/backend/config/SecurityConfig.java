package com.insurai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .authorizeHttpRequests(auth -> auth
                        // allow all preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public auth and plans
                        .requestMatchers("/api/users/register",
                                "/api/users/login",
                                "/api/plans",
                                "/api/plans/{id}").permitAll()

                        // Agent dashboard endpoints – allow for now
                        .requestMatchers("/api/agents/me",
                                "/api/agents/me/stats",
                                "/api/agents/me/appointments").permitAll()

                        // Other agents and users – also allowed while you develop
                        .requestMatchers(HttpMethod.POST, "/api/agents/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/agents/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/users/**").permitAll()

                        // Admin-only plan modification
                        //.requestMatchers(HttpMethod.POST, "/api/plans/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/plans/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/plans/**").hasRole("ADMIN")

                        // everything under /api/** allowed for now
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"   // PATCH added
        ));
        configuration.setAllowedHeaders(List.of("*"));
        // configuration.setAllowCredentials(true); // only if you use cookies/tokens in browser

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
