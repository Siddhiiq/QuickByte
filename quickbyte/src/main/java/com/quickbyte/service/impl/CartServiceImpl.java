package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.CartItemRequest;
import com.quickbyte.dto.Response.CartResponse;
import com.quickbyte.entity.Cart.Cart;
import com.quickbyte.entity.Cart.CartItem;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodVariant;
import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.CartMapper;
import com.quickbyte.repository.CartItemRepository;
import com.quickbyte.repository.CartRepository;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.repository.FoodVariantRepository;
import com.quickbyte.repository.UserRepository;
import com.quickbyte.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final FoodRepository foodRepository;

    private final FoodVariantRepository foodVariantRepository;

    @Override
    public CartResponse addItemToCart(
            CartItemRequest request) {

        Users user = userRepository.findById(
                        request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        Cart cart = cartRepository
                .findByUserId(user.getId())
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .totalAmount(BigDecimal.ZERO)
                            .totalItems(0)
                            .build();

                    return cartRepository.save(newCart);

                });

        Food food = foodRepository
                .findById(request.getFoodId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"));

        FoodVariant variant =
                foodVariantRepository
                        .findById(request.getVariantId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Variant not found"));

        CartItem cartItem =
                cartItemRepository
                        .findByCartIdAndFoodIdAndVariantId(
                                cart.getId(),
                                food.getId(),
                                variant.getId())
                        .orElse(null);

        if (cartItem == null) {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .food(food)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .unitPrice(variant.getPrice())
                    .totalPrice(
                            variant.getPrice().multiply(
                                    BigDecimal.valueOf(
                                            request.getQuantity())))
                    .build();

        } else {

            cartItem.setQuantity(
                    cartItem.getQuantity()
                            + request.getQuantity());

            cartItem.setTotalPrice(
                    cartItem.getUnitPrice().multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity())));
        }

        cartItemRepository.save(cartItem);

        recalculateCart(cart);

        cartRepository.save(cart);

        return CartMapper.toResponse(cart);

    }

    private void recalculateCart(Cart cart) {

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(
                        cart.getId());

        BigDecimal totalAmount = BigDecimal.ZERO;

        int totalItems = 0;

        for (CartItem item : cartItems) {

            totalAmount = totalAmount.add(
                    item.getTotalPrice());

            totalItems += item.getQuantity();

        }

        cart.setTotalAmount(totalAmount);

        cart.setTotalItems(totalItems);

    }
    @Override
    public CartResponse getCart(Long userId) {

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse removeItem(
            Long userId,
            Long cartItemId) {

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException(
                    "Cart item does not belong to this user");
        }

        cartItemRepository.delete(cartItem);

        recalculateCart(cart);

        cartRepository.save(cart);

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse clearCart(Long userId) {

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        cartItemRepository.deleteAll(cartItems);

        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setTotalItems(0);

        cartRepository.save(cart);

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse updateItemQuantity(
            Long userId,
            Long cartItemId,
            Integer quantity) {

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1");
        }

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"));

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException(
                    "Cart item does not belong to this user");
        }

        cartItem.setQuantity(quantity);

        cartItem.setTotalPrice(
                cartItem.getUnitPrice().multiply(
                        BigDecimal.valueOf(quantity)
                )
        );

        cartItemRepository.save(cartItem);

        recalculateCart(cart);

        cartRepository.save(cart);

        return CartMapper.toResponse(cart);
    }

}