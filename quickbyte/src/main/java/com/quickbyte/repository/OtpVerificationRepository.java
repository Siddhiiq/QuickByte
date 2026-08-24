package com.quickbyte.repository;

import com.quickbyte.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailOrderByIdDesc(String email);
}
