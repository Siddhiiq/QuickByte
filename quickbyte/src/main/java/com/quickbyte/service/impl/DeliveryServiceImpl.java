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
                                new ResourceNotFoundException("Delivery Partner not found"));

        Order order =
                orderRepository.findById(
                                request.getOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Order not found"));

        if (!partner.getAvailable()) {
            throw new ResourceNotFoundException(
                    "Delivery Partner is not available");
        }

        partner.setOrder(order);
        partner.setAvailable(false);
        partner.setDeliveryStatus(
                DeliveryStatus.ASSIGNED);

        return DeliveryMapper.toResponse(
                deliveryPartnerRepository.save(partner));
    }

    @Override
    public DeliveryResponse updateDeliveryStatus(
            Long deliveryPartnerId,
            DeliveryStatus status) {

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(
                                deliveryPartnerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Delivery Partner not found"));

        partner.setDeliveryStatus(status);

        if (status == DeliveryStatus.DELIVERED) {
            partner.setAvailable(true);
            partner.setOrder(null);
        }

        return DeliveryMapper.toResponse(
                deliveryPartnerRepository.save(partner));
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