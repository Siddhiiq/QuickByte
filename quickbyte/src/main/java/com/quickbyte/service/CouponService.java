package com.quickbyte.service;

import com.quickbyte.dto.Request.CouponRequest;
import com.quickbyte.dto.Response.CouponResponse;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {

    CouponResponse createCoupon(CouponRequest request);

    CouponResponse getCoupon(Long couponId);

    List<CouponResponse> getAllCoupons();

    CouponResponse applyCoupon(
            String couponCode,
            BigDecimal orderAmount);

    void deleteCoupon(Long couponId);

}