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

        String requestPath = request.getServletPath();

        /*
         * Public APIs
         */if (requestPath.startsWith("/api/v1/users")
                || requestPath.startsWith("/api/v1/restaurants")
                || requestPath.startsWith("/api/v1/categories")
                || requestPath.startsWith("/api/v1/foods")
                || requestPath.startsWith("/api/v1/food-variants")
                || requestPath.startsWith("/api/v1/food-images")
                || requestPath.startsWith("/api/v1/cart")
                || requestPath.startsWith("/api/v1/orders")
                || requestPath.startsWith("/api/v1/payments")
                || requestPath.startsWith("/api/v1/coupons")
                || requestPath.startsWith("/api/v1/reviews")
                || requestPath.startsWith("/api/v1/delivery")
                || requestPath.startsWith("/api/v1/admin"))
         {

            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken =
                authHeader.substring(7);

        String email =
                jwtService.extractUsername(jwtToken);

        if (email != null
                && SecurityContextHolder
                .getContext()
                .getAuthentication() == null) {

            UserDetails userDetails =
                    customUserDetailsService
                            .loadUserByUsername(email);
            String role = jwtService.extractRole(jwtToken);

// Optional debug
            System.out.println("Authenticated User : " + email);
            System.out.println("Role : " + role);

            if (jwtService.isTokenValid(
                    jwtToken,
                    userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken authenticationToken =
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
                        .setAuthentication(authenticationToken);

            }

        }

        filterChain.doFilter(request, response);

    }

}