package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CartResponse;
import com.quickbyte.entity.Cart.Cart;

public class CartMapper {

    private CartMapper(){}

    public static CartResponse toResponse(
            Cart cart){

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .customerName(cart.getUser().getFullName())
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getTotalItems())
                .build();

    }

}