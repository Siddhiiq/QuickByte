package com.quickbyte.entity.Payment;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.enums.PaymentMethod;
import com.quickbyte.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 150)
    private String transactionId;

    @Column(length = 150)
    private String gatewayOrderId;

    @Column(length = 150)
    private String gatewayPaymentId;

    @Column(length = 500)
    private String failureReason;

    @PrePersist
    public void prePersist() {

        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }

    }
}