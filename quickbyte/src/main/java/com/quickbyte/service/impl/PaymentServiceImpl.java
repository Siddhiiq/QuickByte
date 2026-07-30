package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.PaymentRequest;
import com.quickbyte.dto.Response.PaymentResponse;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.entity.Payment.Payment;
import com.quickbyte.enums.PaymentStatus;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.PaymentMapper;
import com.quickbyte.repository.OrderRepository;
import com.quickbyte.repository.PaymentRepository;
import com.quickbyte.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    public PaymentResponse createPayment(
            PaymentRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Payment already exists");
        }

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .amount(order.getGrandTotal())
                .build();

        Payment saved = paymentRepository.save(payment);

        return PaymentMapper.toResponse(saved);
    }

    @Override
    public PaymentResponse getPaymentByOrder(
            Long orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found"));

        return PaymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse markPaymentSuccess(
            Long orderId,
            String transactionId,
            String gatewayPaymentId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(transactionId);
        payment.setGatewayPaymentId(gatewayPaymentId);

        Payment updated = paymentRepository.save(payment);

        return PaymentMapper.toResponse(updated);
    }

    @Override
    public PaymentResponse markPaymentFailed(
            Long orderId,
            String reason) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason);

        Payment updated = paymentRepository.save(payment);

        return PaymentMapper.toResponse(updated);
    }

}