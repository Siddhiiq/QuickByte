package com.quickbyte.dto.Response;

import com.quickbyte.enums.OrderStatus;
import com.quickbyte.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private Long customerId;

    private String customerName;

    private Long restaurantId;

    private String restaurantName;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private BigDecimal subTotal;

    private BigDecimal deliveryCharge;

    private BigDecimal tax;

    private BigDecimal grandTotal;

    private String notes;

    private List<OrderItemResponse> items;

}