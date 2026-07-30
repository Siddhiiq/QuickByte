package com.quickbyte.dto.Response;

import com.quickbyte.enums.PaymentMethod;
import com.quickbyte.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;

    private Long orderId;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private BigDecimal amount;

    private String transactionId;

    private String gatewayOrderId;

    private String gatewayPaymentId;

    private String failureReason;

}