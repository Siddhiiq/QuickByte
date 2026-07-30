package com.quickbyte.dto.Request;

import com.quickbyte.enums.CouponType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponRequest {

    @NotBlank
    private String couponCode;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private CouponType couponType;

    @NotNull
    private BigDecimal discountValue;

    @NotNull
    private BigDecimal minimumOrderAmount;

    private BigDecimal maximumDiscount;

    @NotNull
    private Integer usageLimit;

    @NotNull
    private LocalDate expiryDate;
}