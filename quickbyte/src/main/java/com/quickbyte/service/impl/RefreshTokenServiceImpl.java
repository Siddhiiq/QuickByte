package com.quickbyte.service.impl;

import com.quickbyte.entity.User.RefreshToken;
import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.repository.RefreshTokenRepository;
import com.quickbyte.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl
        implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    // 7 Days
    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    @Override
    public RefreshToken createRefreshToken(Users user) {

        refreshTokenRepository.findByUser(user)
                .ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiryDate(
                        LocalDateTime.now()
                                .plusDays(REFRESH_TOKEN_EXPIRY_DAYS)
                )
                .user(user)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {

        RefreshToken refreshToken =
                refreshTokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Refresh Token not found"));

        if (refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            refreshTokenRepository.delete(refreshToken);

            throw new RuntimeException(
                    "Refresh Token Expired");
        }

        return refreshToken;
    }

    @Override
    public void deleteByUser(Users user) {

        refreshTokenRepository.deleteByUser(user);

    }
}