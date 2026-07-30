package com.quickbyte.dto.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private Long deliveryPartnerId;

}