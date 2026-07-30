package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CartItemResponse;
import com.quickbyte.entity.Cart.CartItem;

public class CartItemMapper {

    private CartItemMapper(){}

    public static CartItemResponse toResponse(
            CartItem item){

        return CartItemResponse.builder()
                .id(item.getId())
                .foodId(item.getFood().getId())
                .foodName(item.getFood().getName())
                .variantId(item.getVariant().getId())
                .variantType(item.getVariant().getVariantType().name())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();

    }

}