package com.quickbyte.mapper;

import com.quickbyte.dto.Response.OrderItemResponse;
import com.quickbyte.dto.Response.OrderResponse;
import com.quickbyte.entity.Order.Order;

public class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {

        return OrderResponse.builder()
                .id(order.getId())

                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getFullName())

                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())

                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())

                .subTotal(order.getSubTotal())
                .deliveryCharge(order.getDeliveryCharge())
                .tax(order.getTax())
                .grandTotal(order.getGrandTotal())

                .notes(order.getNotes())

                .items(
                        order.getOrderItems()
                                .stream()
                                .map(item ->
                                        OrderItemResponse.builder()
                                                .foodId(item.getFood().getId())
                                                .foodName(item.getFood().getName())
                                                .variant(item.getVariant().getVariantType().name())
                                                .quantity(item.getQuantity())
                                                .unitPrice(item.getUnitPrice())
                                                .totalPrice(item.getTotalPrice())
                                                .build()
                                )
                                .toList()
                )

                .build();

    }

}