package com.quickbyte.service;

import com.quickbyte.dto.Request.OrderRequest;
import com.quickbyte.dto.Response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrder(Long orderId);

    List<OrderResponse> getCustomerOrders(Long customerId);

    List<OrderResponse> getRestaurantOrders(Long restaurantId);

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getOrdersByStatus(
            String status
    );


    OrderResponse updateOrderStatus(
            Long orderId,
            String status);

    void cancelOrder(Long orderId);

}