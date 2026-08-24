package com.quickbyte.service;

import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(
            UserRepository userRepository,
            OtpService otpService,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Send password reset OTP
     */
    public void forgotPassword(String email) {

        Users user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        otpService.sendOtp(user.getEmail());
    }

    /**
     * Verify OTP and reset password
     */
    public boolean resetPassword(
            String email,
            String otp,
            String newPassword) {

        Users user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        boolean otpVerified =
                otpService.verifyOtp(email, otp);

        if (!otpVerified) {
            return false;
        }

        String encodedPassword =
                passwordEncoder.encode(newPassword);

        user.setPassword(encodedPassword);

        userRepository.save(user);

        return true;
    }
}