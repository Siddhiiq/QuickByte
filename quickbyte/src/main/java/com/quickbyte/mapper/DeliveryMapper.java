package com.quickbyte.mapper;

import com.quickbyte.dto.Response.DeliveryResponse;
import com.quickbyte.entity.Delivery.DeliveryPartner;

public class DeliveryMapper {

    private DeliveryMapper() {
    }

    public static DeliveryResponse toResponse(
            DeliveryPartner partner) {

        return DeliveryResponse.builder()
                .deliveryPartnerId(
                        partner.getId()
                )
                .deliveryPartnerName(
                        partner.getName()
                )
                .phoneNumber(
                        partner.getPhoneNumber()
                )
                .orderId(
                        partner.getOrder() != null
                                ? partner.getOrder().getId()
                                : null
                )
                .orderStatus(
                        partner.getOrder() != null
                                ? partner.getOrder()
                                .getOrderStatus()
                                : null
                )
                .deliveryStatus(
                        partner.getDeliveryStatus()
                )
                .available(
                        partner.getAvailable()
                )
                .build();
    }
}