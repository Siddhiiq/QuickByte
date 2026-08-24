package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.PaymentRequest;
import com.quickbyte.dto.Response.PaymentResponse;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.entity.Payment.Payment;
import com.quickbyte.enums.OrderStatus;
import com.quickbyte.enums.PaymentStatus;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.PaymentMapper;
import com.quickbyte.repository.OrderRepository;
import com.quickbyte.repository.PaymentRepository;
import com.quickbyte.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    public PaymentResponse createPayment(
            PaymentRequest request) {

        Order order =
                orderRepository.findById(
                        request.getOrderId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        /*
         * If a payment already exists:
         *
         * - PENDING  → return existing payment
         * - FAILED   → allow retry by resetting it
         * - SUCCESS  → do not create another payment
         */
        var existingPayment =
                paymentRepository.findByOrderId(
                        order.getId()
                );

        if (existingPayment.isPresent()) {

            Payment payment =
                    existingPayment.get();

            if (payment.getPaymentStatus()
                    == PaymentStatus.SUCCESS) {

                throw new ResourceAlreadyExistsException(
                        "Payment already completed"
                );
            }

            if (payment.getPaymentStatus()
                    == PaymentStatus.FAILED) {

                payment.setPaymentStatus(
                        PaymentStatus.PENDING
                );

                payment.setFailureReason(null);
                payment.setTransactionId(null);
                payment.setGatewayPaymentId(null);
                payment.setGatewayOrderId(null);

                payment.setPaymentMethod(
                        request.getPaymentMethod()
                );

                Payment updated =
                        paymentRepository.save(payment);

                return PaymentMapper.toResponse(updated);
            }

            return PaymentMapper.toResponse(payment);
        }

        Payment payment =
                Payment.builder()

                        .order(order)

                        .paymentMethod(
                                request.getPaymentMethod()
                        )

                        .paymentStatus(
                                PaymentStatus.PENDING
                        )

                        .amount(
                                order.getGrandTotal()
                        )

                        .build();

        Payment saved =
                paymentRepository.save(payment);

        return PaymentMapper.toResponse(saved);
    }


    @Override
    public PaymentResponse getPaymentByOrder(
            Long orderId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found"
                                )
                        );

        return PaymentMapper.toResponse(payment);
    }


    @Override
    public PaymentResponse markPaymentSuccess(
            Long orderId,
            String transactionId,
            String gatewayPaymentId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found"
                                )
                        );

        Order order = payment.getOrder();

        /*
         * Prevent a completed payment from
         * being processed again.
         */
        if (payment.getPaymentStatus()
                == PaymentStatus.SUCCESS) {

            return PaymentMapper.toResponse(payment);
        }

        /*
         * Mark payment successful.
         */
        payment.setPaymentStatus(
                PaymentStatus.SUCCESS
        );

        payment.setTransactionId(
                transactionId
        );

        payment.setGatewayPaymentId(
                gatewayPaymentId
        );

        payment.setFailureReason(null);

        /*
         * IMPORTANT:
         *
         * Only after successful online payment
         * do we confirm the order.
         */
        order.setPaymentStatus(
                PaymentStatus.SUCCESS
        );

        order.setOrderStatus(
                OrderStatus.CONFIRMED
        );

        orderRepository.save(order);

        Payment updated =
                paymentRepository.save(payment);

        return PaymentMapper.toResponse(updated);
    }


    @Override
    public PaymentResponse markPaymentFailed(
            Long orderId,
            String reason) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found"
                                )
                        );

        payment.setPaymentStatus(
                PaymentStatus.FAILED
        );

        payment.setFailureReason(
                reason
        );

        /*
         * Keep the order PENDING.
         *
         * This allows the customer to retry
         * payment instead of losing the order.
         */
        Order order =
                payment.getOrder();

        order.setPaymentStatus(
                PaymentStatus.FAILED
        );

        order.setOrderStatus(
                OrderStatus.PENDING
        );

        orderRepository.save(order);

        Payment updated =
                paymentRepository.save(payment);

        return PaymentMapper.toResponse(updated);
    }
}