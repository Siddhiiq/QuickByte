package com.quickbyte.service;

import com.quickbyte.dto.Request.PaymentRequest;
import com.quickbyte.dto.Response.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(
            PaymentRequest request);

    PaymentResponse getPaymentByOrder(
            Long orderId);

    PaymentResponse markPaymentSuccess(
            Long orderId,
            String transactionId,
            String gatewayPaymentId);

    PaymentResponse markPaymentFailed(
            Long orderId,
            String reason);

}