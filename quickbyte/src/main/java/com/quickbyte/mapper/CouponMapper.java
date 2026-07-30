package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CouponResponse;
import com.quickbyte.entity.Coupon.Coupon;

public class CouponMapper {

    private CouponMapper() {
    }

    public static CouponResponse toResponse(Coupon coupon) {

        return CouponResponse.builder()
                .id(coupon.getId())
                .couponCode(coupon.getCouponCode())
                .title(coupon.getTitle())
                .description(coupon.getDescription())
                .couponType(coupon.getCouponType())
                .discountValue(coupon.getDiscountValue())
                .minimumOrderAmount(coupon.getMinimumOrderAmount())
                .maximumDiscount(coupon.getMaximumDiscount())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .expiryDate(coupon.getExpiryDate())
                .status(coupon.getStatus())
                .build();
    }

}