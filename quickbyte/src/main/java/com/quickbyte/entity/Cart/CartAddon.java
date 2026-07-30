package com.quickbyte.entity.Cart;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Food.FoodAddon;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_addons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartAddon extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_item_id", nullable = false)
    private CartItem cartItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_addon_id", nullable = false)
    private FoodAddon foodAddon;

    @Column(nullable = false, length = 100)
    private String addonName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal addonPrice;

    @PrePersist
    public void prePersist() {

        if (addonName == null && foodAddon != null) {
            addonName = foodAddon.getName();
        }

        if (addonPrice == null && foodAddon != null) {
            addonPrice = foodAddon.getPrice();
        }

    }
}