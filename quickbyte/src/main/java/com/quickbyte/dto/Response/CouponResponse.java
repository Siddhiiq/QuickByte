package com.quickbyte.dto.Response;

import com.quickbyte.enums.CouponStatus;
import com.quickbyte.enums.CouponType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponResponse {

    private Long id;

    private String couponCode;

    private String title;

    private String description;

    private CouponType couponType;

    private BigDecimal discountValue;

    private BigDecimal minimumOrderAmount;

    private BigDecimal maximumDiscount;

    private Integer usageLimit;

    private Integer usedCount;

    private LocalDate expiryDate;

    private CouponStatus status;
}