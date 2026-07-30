package com.quickbyte.entity.Cart;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.User.Users;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",
            nullable = false,
            unique = true)
    private Users user;

    @Column(nullable = false,
            precision = 12,
            scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private Integer totalItems;

    @OneToMany(
            mappedBy = "cart",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<CartItem> cartItems =
            new ArrayList<>();

    @PrePersist
    public void prePersist(){

        if(totalAmount==null){
            totalAmount=BigDecimal.ZERO;
        }

        if(totalItems==null){
            totalItems=0;
        }

    }

}