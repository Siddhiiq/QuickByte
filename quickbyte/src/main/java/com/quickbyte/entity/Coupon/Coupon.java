package com.quickbyte.entity.Coupon;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.enums.CouponStatus;
import com.quickbyte.enums.CouponType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "coupons",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = "coupon_code"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends BaseEntity {

    @Column(name = "coupon_code",
            nullable = false,
            length = 30)
    private String couponCode;

    @Column(nullable = false,
            length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponType couponType;

    @Column(nullable = false,
            precision = 10,
            scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false,
            precision = 10,
            scale = 2)
    private BigDecimal minimumOrderAmount;

    @Column(precision = 10,
            scale = 2)
    private BigDecimal maximumDiscount;

    @Column(nullable = false)
    private Integer usageLimit;

    @Column(nullable = false)
    private Integer usedCount;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponStatus status;

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = CouponStatus.ACTIVE;
        }

        if (usedCount == null) {
            usedCount = 0;
        }

        if (usageLimit == null) {
            usageLimit = 100;
        }
    }
}