package com.quickbyte.repository;

import com.quickbyte.entity.Cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);

    Optional<CartItem> findByCartIdAndFoodIdAndVariantId(
            Long cartId,
            Long foodId,
            Long variantId
    );
}