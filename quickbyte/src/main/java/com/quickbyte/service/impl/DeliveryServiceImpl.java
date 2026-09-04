package com.quickbyte.service.impl;


import com.quickbyte.dto.Request.DeliveryRequest;
import com.quickbyte.dto.Response.DeliveryResponse;
import com.quickbyte.entity.Delivery.DeliveryPartner;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.enums.DeliveryStatus;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.DeliveryMapper;
import com.quickbyte.repository.DeliveryPartnerRepository;
import com.quickbyte.repository.OrderRepository;
import com.quickbyte.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.quickbyte.enums.OrderStatus;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl
        implements DeliveryService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    private final OrderRepository orderRepository;

    @Override
    public DeliveryResponse assignOrder(
            DeliveryRequest request) {

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(
                                request.getDeliveryPartnerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery Partner not found"
                                )
                        );

        Order order =
                orderRepository.findById(
                                request.getOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );

        /*
         * Only orders ready for pickup
         * can be assigned to a delivery partner.
         */
        if (order.getOrderStatus() !=
                OrderStatus.READY_FOR_PICKUP) {

            throw new IllegalStateException(
                    "Only orders ready for pickup can be assigned to a delivery partner"
            );
        }

        /*
         * Partner must be available.
         */
        if (!Boolean.TRUE.equals(
                partner.getAvailable())) {

            throw new IllegalStateException(
                    "Delivery Partner is not available"
            );
        }

        /*
         * Assign order to partner.
         */
        partner.setOrder(order);

        partner.setAvailable(false);

        partner.setDeliveryStatus(
                DeliveryStatus.ASSIGNED
        );

        /*
         * Update the actual order status.
         */
        order.setOrderStatus(
                OrderStatus.OUT_FOR_DELIVERY
        );

        /*
         * Save both entities.
         */
        orderRepository.save(order);

        DeliveryPartner savedPartner =
                deliveryPartnerRepository.save(
                        partner
                );

        return DeliveryMapper.toResponse(
                savedPartner
        );
    }

    @Override
    public DeliveryResponse updateDeliveryStatus(
            Long deliveryPartnerId,
            DeliveryStatus status) {

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(
                                deliveryPartnerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery Partner not found"
                                )
                        );

        /*
         * Partner must currently
         * have an assigned order.
         */
        if (partner.getOrder() == null) {

            throw new IllegalStateException(
                    "No order is currently assigned to this delivery partner"
            );
        }

        partner.setDeliveryStatus(status);

        /*
         * Get assigned order.
         */
        Order order =
                partner.getOrder();

        /*
         * When delivery is completed,
         * update the actual order.
         */
        if (status == DeliveryStatus.DELIVERED) {

            order.setOrderStatus(
                    OrderStatus.DELIVERED
            );

            orderRepository.save(order);

            /*
             * Make partner available again.
             */
            partner.setAvailable(true);

            partner.setOrder(null);
        }

        DeliveryPartner savedPartner =
                deliveryPartnerRepository.save(
                        partner
                );

        return DeliveryMapper.toResponse(
                savedPartner
        );
    }

    @Override
    public DeliveryResponse getDelivery(
            Long deliveryPartnerId) {

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(
                                deliveryPartnerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Delivery Partner not found"));

        return DeliveryMapper.toResponse(partner);
    }

    @Override
    public List<DeliveryResponse> getAvailablePartners() {

        return deliveryPartnerRepository
                .findByAvailableTrue()
                .stream()
                .map(DeliveryMapper::toResponse)
                .collect(Collectors.toList());
    }
}