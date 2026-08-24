package com.quickbyte.controller;

import com.quickbyte.dto.Request.SendOtpRequest;
import com.quickbyte.dto.Request.VerifyOtpRequest;
import com.quickbyte.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final OtpService otpService;

    /**
     * Send OTP
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "OTP sent successfully"
                )
        );
    }

    /**
     * Verify OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        boolean verified =
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                );

        if (!verified) {

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
                        "OTP verified successfully"
                )
        );
    }
}