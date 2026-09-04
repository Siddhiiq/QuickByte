package com.quickbyte.security.jwt;

import com.quickbyte.security.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestPath = request.getServletPath();
        String method = request.getMethod();

        /*
         * Skip authentication only for completely public endpoints.
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

                || (method.equals("GET")
                && requestPath.startsWith("/api/v1/restaurants")
                && !requestPath.equals("/api/v1/restaurants/my"))

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

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken =
                authHeader.substring(7);

        try {

            String email =
                    jwtService.extractUsername(jwtToken);

            if (email != null
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService
                                .loadUserByUsername(email);

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

                    System.out.println(
                            "JWT AUTHENTICATION SUCCESS: "
                                    + email
                    );

                    System.out.println(
                            "AUTHORITIES: "
                                    + userDetails.getAuthorities()
                    );
                }
            }

        } catch (ExpiredJwtException e) {

            System.out.println("JWT TOKEN EXPIRED");

            SecurityContextHolder.clearContext();

        } catch (JwtException e) {

            System.out.println(
                    "INVALID JWT TOKEN: "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}