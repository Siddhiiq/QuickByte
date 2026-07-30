package com.quickbyte.repository;

import com.quickbyte.entity.Cart.CartAddon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartAddonRepository
        extends JpaRepository<CartAddon, Long> {

    List<CartAddon> findByCartItemId(Long cartItemId);

}