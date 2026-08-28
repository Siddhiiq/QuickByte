package com.quickbyte.security.jwt;

import com.quickbyte.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)

            throws ServletException, IOException {

        System.out.println("===== JWT FILTER EXECUTED =====");
        System.out.println("Request Path : " + request.getServletPath());

        String requestPath = request.getServletPath();
        String method = request.getMethod();

        /*
         * Public APIs
         *
         * These APIs should not go through JWT authentication.
         */
        if (requestPath.equals("/api/v1/users/register")
                || requestPath.equals("/api/v1/users/login")
                || requestPath.equals("/api/v1/users/refresh-token")

                || requestPath.startsWith("/api/v1/email")
                || requestPath.startsWith("/api/v1/auth")

                || requestPath.startsWith("/v3/api-docs")
                || requestPath.startsWith("/swagger-ui")
                || requestPath.startsWith("/swagger-resources")
                || requestPath.startsWith("/webjars")

                /*
                 * Public restaurant/menu GET APIs
                 */
                || (method.equals("GET")
                && (
                requestPath.equals("/api/v1/restaurants")
                        || requestPath.matches("/api/v1/restaurants/\\d+")
        ))

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/categories"))

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/foods"))

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/food-variants"))

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/food-images"))

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/food-addons"))) {

            System.out.println(
                    "===== PUBLIC API - JWT SKIPPED =====");

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Get Authorization header
         */
        final String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization Header : " + authHeader);

        /*
         * No token
         */
        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Extract JWT
         */
        String jwtToken =
                authHeader.substring(7);

        String email =
                jwtService.extractUsername(jwtToken);

        /*
         * Authenticate user
         */
        if (email != null
                && SecurityContextHolder
                .getContext()
                .getAuthentication() == null) {

            UserDetails userDetails =
                    customUserDetailsService
                            .loadUserByUsername(email);

            String role =
                    jwtService.extractRole(jwtToken);

            System.out.println(
                    "Authenticated User : " + email);

            System.out.println(
                    "JWT Role : " + role);

            System.out.println(
                    "Authorities : "
                            + userDetails.getAuthorities());

            if (jwtService.isTokenValid(
                    jwtToken,
                    userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken
                        authenticationToken =
                        new UsernamePasswordAuthenticationToken(

                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authenticationToken
                        );
            }
        }

        filterChain.doFilter(request, response);
    }
}