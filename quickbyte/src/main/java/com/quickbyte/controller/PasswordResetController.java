package com.quickbyte.controller;

import com.quickbyte.dto.Request.ForgotPasswordRequest;
import com.quickbyte.dto.Request.ResetPasswordRequest;
import com.quickbyte.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * Forgot Password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.forgotPassword(
                request.getEmail()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset OTP sent successfully"
                )
        );
    }

    /**
     * Reset Password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        boolean reset =
                passwordResetService.resetPassword(
                        request.getEmail(),
                        request.getOtp(),
                        request.getNewPassword()
                );

        if (!reset) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Invalid or expired OTP"
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully"
                )
        );
    }
}