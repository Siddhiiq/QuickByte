package com.quickbyte.service;

import com.quickbyte.entity.OtpVerification;
import com.quickbyte.repository.OtpVerificationRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(
            OtpVerificationRepository otpRepository,
            EmailService emailService) {

        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public void sendOtp(String email) {

        String otp = String.valueOf(
                100000 + secureRandom.nextInt(900000)
        );

        LocalDateTime expiresAt =
                LocalDateTime.now().plusMinutes(5);

        OtpVerification otpVerification =
                new OtpVerification(
                        email,
                        otp,
                        expiresAt
                );

        otpRepository.save(otpVerification);

        String subject = "QuickByte OTP Verification";

        String body =
                "Hello,\n\n"
                        + "Your QuickByte verification OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes.\n\n"
                        + "If you did not request this OTP, please ignore this email.\n\n"
                        + "Regards,\n"
                        + "QuickByte Team";

        emailService.sendSimpleEmail(
                email,
                subject,
                body
        );
    }

    public boolean verifyOtp(
            String email,
            String otp) {

        OtpVerification otpVerification =
                otpRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "OTP not found"
                                )
                        );

        if (otpVerification.isVerified()) {
            return false;
        }

        if (LocalDateTime.now()
                .isAfter(otpVerification.getExpiresAt())) {
            return false;
        }

        if (!otpVerification.getOtp().equals(otp)) {
            return false;
        }

        otpVerification.setVerified(true);

        otpRepository.save(otpVerification);

        return true;
    }
}