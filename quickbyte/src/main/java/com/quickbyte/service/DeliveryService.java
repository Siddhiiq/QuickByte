package com.quickbyte.service;

import com.quickbyte.dto.Request.DeliveryRequest;
import com.quickbyte.dto.Response.DeliveryResponse;
import com.quickbyte.enums.DeliveryStatus;

import java.util.List;

public interface DeliveryService {

    DeliveryResponse assignOrder(
            DeliveryRequest request
    );

    DeliveryResponse updateDeliveryStatus(
            Long deliveryPartnerId,
            DeliveryStatus status
    );

    DeliveryResponse getDelivery(
            Long deliveryPartnerId
    );

    List<DeliveryResponse>
    getAvailablePartners();

    List<DeliveryResponse>
    getActiveDeliveries();

}