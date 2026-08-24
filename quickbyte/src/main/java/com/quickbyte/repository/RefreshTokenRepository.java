package com.quickbyte.repository;

import com.quickbyte.entity.User.RefreshToken;
import com.quickbyte.entity.User.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(Users user);

    void deleteByUser(Users user);
}