package com.quickbyte.service;

import com.quickbyte.dto.Request.CartItemRequest;
import com.quickbyte.dto.Response.CartResponse;

public interface CartService {

    CartResponse addItemToCart(
            CartItemRequest request);

    CartResponse getCart(
            Long userId);

    CartResponse removeItem(
            Long userId,
            Long cartItemId);

    CartResponse clearCart(
            Long userId);

}