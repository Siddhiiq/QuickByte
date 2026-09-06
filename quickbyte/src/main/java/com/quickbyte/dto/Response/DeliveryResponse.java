package com.quickbyte.dto.Response;

import com.quickbyte.enums.DeliveryStatus;
import com.quickbyte.enums.OrderStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryResponse {

    private Long deliveryPartnerId;

    private String deliveryPartnerName;

    private String phoneNumber;

    private Long orderId;

    private OrderStatus orderStatus;

    private DeliveryStatus deliveryStatus;

    private Boolean available;

}