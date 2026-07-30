package com.quickbyte.entity.User;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.enums.AccountStatus;
import com.quickbyte.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import com.quickbyte.entity.Cart.Cart;
import com.quickbyte.entity.Review.Review;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 30)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    @OneToMany(
            mappedBy = "customer",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private Cart cart;

    @OneToMany(
            mappedBy = "owner",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Restaurant> restaurants = new ArrayList<>();

    @PrePersist
    public void prePersist() {

        if (role == null) {
            role = Role.CUSTOMER;
        }

        if (accountStatus == null) {
            accountStatus = AccountStatus.ACTIVE;
        }

    }

}