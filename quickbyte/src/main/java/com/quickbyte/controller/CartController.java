package com.quickbyte.controller;

import com.quickbyte.dto.Request.CartItemRequest;
import com.quickbyte.dto.Response.CartResponse;
import com.quickbyte.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addItemToCart(
            @Valid @RequestBody CartItemRequest request) {

        return cartService.addItemToCart(request);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CartResponse getCart(
            @PathVariable Long userId) {

        return cartService.getCart(userId);
    }

    @DeleteMapping("/items/{cartItemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CartResponse removeItem(
            @PathVariable Long cartItemId,
            @RequestParam Long userId) {

        return cartService.removeItem(userId, cartItemId);
    }

    @DeleteMapping("/clear/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CartResponse clearCart(
            @PathVariable Long userId) {

        return cartService.clearCart(userId);
    }

    @PutMapping("/items/{cartItemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CartResponse updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Long userId,
            @RequestParam Integer quantity) {

        return cartService.updateItemQuantity(
                userId,
                cartItemId,
                quantity
        );
    }
}