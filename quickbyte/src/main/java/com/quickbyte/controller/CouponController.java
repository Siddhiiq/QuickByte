package com.quickbyte.controller;

import com.quickbyte.dto.Request.CouponRequest;
import com.quickbyte.dto.Response.CouponResponse;
import com.quickbyte.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CouponResponse createCoupon(
            @Valid @RequestBody CouponRequest request) {

        return couponService.createCoupon(request);
    }

    @GetMapping("/{couponId}")
    public CouponResponse getCoupon(
            @PathVariable Long couponId) {

        return couponService.getCoupon(couponId);
    }

    @GetMapping
    public List<CouponResponse> getAllCoupons() {

        return couponService.getAllCoupons();
    }

    @PostMapping("/apply")
    public CouponResponse applyCoupon(

            @RequestParam String couponCode,

            @RequestParam BigDecimal orderAmount) {

        return couponService.applyCoupon(
                couponCode,
                orderAmount);
    }

    @DeleteMapping("/{couponId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCoupon(
            @PathVariable Long couponId) {

        couponService.deleteCoupon(couponId);
    }

}