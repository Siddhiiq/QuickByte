package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.OrderRequest;
import com.quickbyte.dto.Response.OrderResponse;
import com.quickbyte.entity.Cart.Cart;
import com.quickbyte.entity.Cart.CartItem;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.entity.Order.OrderAddress;
import com.quickbyte.entity.Order.OrderItem;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.User.Users;
import com.quickbyte.enums.OrderStatus;
import com.quickbyte.enums.PaymentStatus;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.OrderMapper;
import com.quickbyte.repository.*;
import com.quickbyte.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final OrderAddressRepository orderAddressRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final RestaurantRepository restaurantRepository;

    @Override
    public OrderResponse placeOrder(
            OrderRequest request) {

        Users customer =
                userRepository.findById(
                                request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found"));

        Cart cart =
                cartRepository.findByUserId(
                                customer.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(
                        cart.getId());

        if (cartItems.isEmpty()) {

            throw new ResourceNotFoundException(
                    "Cart is empty");
        }

        Restaurant restaurant =
                cartItems.get(0)
                        .getFood()
                        .getCategory()
                        .getRestaurant();

        Order order = Order.builder()

                .customer(customer)

                .restaurant(restaurant)

                .orderStatus(OrderStatus.PENDING)

                .paymentStatus(PaymentStatus.PENDING)

                .subTotal(cart.getTotalAmount())

                .deliveryCharge(
                        BigDecimal.valueOf(40))

                .tax(
                        cart.getTotalAmount()
                                .multiply(
                                        BigDecimal.valueOf(0.05)))

                .notes(request.getNotes())

                .build();

        BigDecimal grandTotal =
                order.getSubTotal()
                        .add(order.getDeliveryCharge())
                        .add(order.getTax());

        order.setGrandTotal(grandTotal);

        Order savedOrder =
                orderRepository.save(order);

        OrderAddress address =
                OrderAddress.builder()

                        .order(savedOrder)

                        .street(request.getStreet())
                        .area(request.getArea())
                        .landmark(request.getLandmark())
                        .city(request.getCity())
                        .district(request.getDistrict())
                        .state(request.getState())
                        .country(request.getCountry())
                        .pincode(request.getPincode())
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())

                        .build();

        orderAddressRepository.save(address);

        List<OrderItem> orderItems =
                new ArrayList<>();

        for (CartItem item : cartItems) {

            OrderItem orderItem =
                    OrderItem.builder()

                            .order(savedOrder)

                            .food(item.getFood())

                            .variant(item.getVariant())

                            .quantity(item.getQuantity())

                            .unitPrice(item.getUnitPrice())

                            .totalPrice(item.getTotalPrice())

                            .build();

            orderItems.add(orderItem);

        }

        orderItemRepository.saveAll(orderItems);

        savedOrder.setOrderItems(orderItems);

        savedOrder.setDeliveryAddress(address);

        cartItemRepository.deleteAll(cartItems);

        cart.setTotalAmount(BigDecimal.ZERO);

        cart.setTotalItems(0);

        cartRepository.save(cart);

        return OrderMapper.toResponse(savedOrder);

    }
    @Override
    public OrderResponse getOrder(Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        return OrderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getCustomerOrders(
            Long customerId) {

        return orderRepository
                .findByCustomerId(customerId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getRestaurantOrders(
            Long restaurantId) {

        return orderRepository
                .findByRestaurantId(restaurantId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse updateOrderStatus(
            Long orderId,
            String status) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setOrderStatus(
                OrderStatus.valueOf(status.toUpperCase()));

        Order updatedOrder =
                orderRepository.save(order);

        return OrderMapper.toResponse(updatedOrder);
    }

    @Override
    public void cancelOrder(Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        if (order.getOrderStatus() == OrderStatus.DELIVERED) {

            throw new ResourceNotFoundException(
                    "Delivered order cannot be cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);
    }

}