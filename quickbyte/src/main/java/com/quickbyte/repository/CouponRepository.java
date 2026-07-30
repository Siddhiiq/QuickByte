package com.quickbyte.repository;


import com.quickbyte.entity.Coupon.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository
        extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCouponCodeIgnoreCase(
            String couponCode);

    boolean existsByCouponCodeIgnoreCase(
            String couponCode);

}