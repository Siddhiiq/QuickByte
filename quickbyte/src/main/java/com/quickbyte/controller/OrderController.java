package com.quickbyte.controller;

import com.quickbyte.dto.Request.OrderRequest;
import com.quickbyte.dto.Response.OrderResponse;
import com.quickbyte.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

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
    @PreAuthorize("hasRole('CUSTOMER')")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(
            @Valid @RequestBody OrderRequest request) {

        return orderService.placeOrder(request);
    }

    /**
     * Get All Orders
     *
     * ADMIN only
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> getAllOrders() {

        return orderService.getAllOrders();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> getOrdersByStatus(
            @PathVariable String status) {

        return orderService.getOrdersByStatus(status);
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
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<OrderResponse> getCustomerOrders(
            @PathVariable Long customerId) {

        return orderService.getCustomerOrders(customerId);
    }

    /**
     * Get Restaurant Orders
     */
    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public List<OrderResponse> getRestaurantOrders(
            @PathVariable Long restaurantId) {

        return orderService.getRestaurantOrders(restaurantId);
    }

    /**
     * Update Order Status
     */
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER','DELIVERY_PARTNER')")
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
    @PreAuthorize("hasRole('CUSTOMER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelOrder(
            @PathVariable Long orderId) {

        orderService.cancelOrder(orderId);
    }
}