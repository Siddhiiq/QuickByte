package com.quickbyte.controller;

import com.quickbyte.dto.Request.PaymentRequest;
import com.quickbyte.dto.Response.PaymentResponse;
import com.quickbyte.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(
            @Valid @RequestBody PaymentRequest request){

        return paymentService.createPayment(request);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PaymentResponse getPayment(
            @PathVariable Long orderId){

        return paymentService.getPaymentByOrder(orderId);
    }

    @PutMapping("/{orderId}/success")
    public PaymentResponse paymentSuccess(

            @PathVariable Long orderId,

            @RequestParam String transactionId,

            @RequestParam String gatewayPaymentId){

        return paymentService.markPaymentSuccess(
                orderId,
                transactionId,
                gatewayPaymentId);
    }

    @PutMapping("/{orderId}/failed")
    public PaymentResponse paymentFailed(

            @PathVariable Long orderId,

            @RequestParam String reason){

        return paymentService.markPaymentFailed(
                orderId,
                reason);
    }

}