package com.quickbyte.repository;

import com.quickbyte.entity.Cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository
        extends JpaRepository<Cart,Long> {

    Optional<Cart> findByUserId(Long userId);

}