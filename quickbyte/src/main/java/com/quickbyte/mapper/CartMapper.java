package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CartItemResponse;
import com.quickbyte.dto.Response.CartResponse;
import com.quickbyte.entity.Cart.Cart;
import com.quickbyte.entity.Cart.CartItem;

import java.util.List;

public class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getCartItems()
                        .stream()
                        .map(CartMapper::toItemResponse)
                        .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .customerName(cart.getUser().getFullName())
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getTotalItems())
                .items(items)
                .build();
    }

    private static CartItemResponse toItemResponse(
            CartItem item) {

        return CartItemResponse.builder()
                .id(item.getId())
                .foodId(item.getFood().getId())
                .foodName(item.getFood().getName())
                .variantId(item.getVariant().getId())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}