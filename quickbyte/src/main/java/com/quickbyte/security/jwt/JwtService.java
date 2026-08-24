package com.quickbyte.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;


    private static final long ACCESS_TOKEN_EXPIRATION =
            1000 * 60 * 15;
    /**
     * Generate Secret Key
     */
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

    }

    /**
     * Generate JWT Token
     */
    public String generateToken(String email, String role) {

        return Jwts.builder()

                .subject(email)

                .claim("role", role)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + ACCESS_TOKEN_EXPIRATION
                        )
                )

                .signWith(getSigningKey())

                .compact();
    }
    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );

    }

    /**
     * Extract Expiration Date
     */
    public Date extractExpiration(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );

    }

    /**
     * Generic Claim Extractor
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);

    }
    public String generateAccessToken(String email, String role) {

        return Jwts.builder()

                .subject(email)

                .claim("role", role)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + ACCESS_TOKEN_EXPIRATION
                        )
                )

                .signWith(getSigningKey())

                .compact();
    }
    /**
     * Parse All Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();

    }

    /**
     * Check Expiration
     */
    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());

    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(
            String token,
            String email) {

        String username =
                extractUsername(token);

        return username.equals(email)
                && !isTokenExpired(token);

    }
    public String extractRole(String token) {

        return extractClaim(
                token,
                claims -> claims.get("role", String.class)
        );

    }

}