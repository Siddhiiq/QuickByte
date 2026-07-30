package com.quickbyte.controller;

import com.quickbyte.dto.Request.OrderRequest;
import com.quickbyte.dto.Response.OrderResponse;
import com.quickbyte.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Place Order
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(
            @Valid @RequestBody OrderRequest request) {

        return orderService.placeOrder(request);
    }

    /**
     * Get Order By Id
     */
    @GetMapping("/{orderId}")
    public OrderResponse getOrder(
            @PathVariable Long orderId) {

        return orderService.getOrder(orderId);
    }

    /**
     * Get Customer Orders
     */
    @GetMapping("/customer/{customerId}")
    public List<OrderResponse> getCustomerOrders(
            @PathVariable Long customerId) {

        return orderService.getCustomerOrders(customerId);
    }

    /**
     * Get Restaurant Orders
     */
    @GetMapping("/restaurant/{restaurantId}")
    public List<OrderResponse> getRestaurantOrders(
            @PathVariable Long restaurantId) {

        return orderService.getRestaurantOrders(restaurantId);
    }

    /**
     * Update Order Status
     */
    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return orderService.updateOrderStatus(
                orderId,
                status
        );
    }

    /**
     * Cancel Order
     */
    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelOrder(
            @PathVariable Long orderId) {

        orderService.cancelOrder(orderId);
    }
}