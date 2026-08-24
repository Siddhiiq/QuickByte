package com.quickbyte.config;

import com.quickbyte.security.CustomUserDetailsService;
import com.quickbyte.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Public APIs
                        .requestMatchers(
                                "/api/v1/users/register",
                                "/api/v1/users/login",
                                "/api/v1/users/refresh-token",
                                "/api/v1/email/**",
                                "/api/v1/redis/**",

                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/v1/images/upload",
                                "/api/v1/auth/send-otp",
                                "/api/v1/auth/verify-otp",
                                "/api/v1/auth/forgot-password",
                                "/api/v1/auth/reset-password"
                        )
                        .permitAll()

                        // Customer
                        .requestMatchers("/api/v1/cart/**")
                        .hasAnyRole("CUSTOMER", "ADMIN")

                        .requestMatchers("/api/v1/orders/**")
                        .hasAnyRole("CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PARTNER", "ADMIN")

                        .requestMatchers("/api/v1/payments/**")
                        .hasAnyRole("CUSTOMER", "ADMIN")

                        .requestMatchers("/api/v1/reviews/**")
                        .hasAnyRole("CUSTOMER", "ADMIN")

                                // Public restaurant/menu read APIs
                                .requestMatchers(HttpMethod.GET, "/api/v1/restaurants/**")
                                .permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**")
                                .permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/v1/foods/**")
                                .permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/v1/food-variants/**")
                                .permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/v1/food-images/**")
                                .permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/v1/food-addons/**")
                                .permitAll()


// Restaurant Owner / Admin write APIs
                                .requestMatchers(
                                        "/api/v1/restaurants/**",
                                        "/api/v1/categories/**",
                                        "/api/v1/foods/**",
                                        "/api/v1/food-variants/**",
                                        "/api/v1/food-images/**",
                                        "/api/v1/food-addons/**"
                                )
                                .hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        // Delivery Partner
                        .requestMatchers("/api/v1/delivery/**")
                        .hasAnyRole("DELIVERY_PARTNER", "ADMIN")

                        .anyRequest()
                        .authenticated()
                )

                .authenticationProvider(authenticationProvider())

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

}