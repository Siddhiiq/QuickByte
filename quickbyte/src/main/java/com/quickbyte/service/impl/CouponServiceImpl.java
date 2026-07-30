package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.CouponRequest;
import com.quickbyte.dto.Response.CouponResponse;
import com.quickbyte.entity.Coupon.Coupon;
import com.quickbyte.enums.CouponStatus;
import com.quickbyte.enums.CouponType;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.CouponMapper;
import com.quickbyte.repository.CouponRepository;
import com.quickbyte.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public CouponResponse createCoupon(CouponRequest request) {

        if (couponRepository.existsByCouponCodeIgnoreCase(
                request.getCouponCode())) {

            throw new ResourceAlreadyExistsException("Coupon already exists");
        }

        Coupon coupon = Coupon.builder()
                .couponCode(request.getCouponCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .couponType(request.getCouponType())
                .discountValue(request.getDiscountValue())
                .minimumOrderAmount(request.getMinimumOrderAmount())
                .maximumDiscount(request.getMaximumDiscount())
                .usageLimit(request.getUsageLimit())
                .expiryDate(request.getExpiryDate())
                .status(CouponStatus.ACTIVE)
                .usedCount(0)
                .build();

        return CouponMapper.toResponse(
                couponRepository.save(coupon));
    }

    @Override
    public CouponResponse getCoupon(Long couponId) {

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Coupon not found"));

        return CouponMapper.toResponse(coupon);
    }

    @Override
    public List<CouponResponse> getAllCoupons() {

        return couponRepository.findAll()
                .stream()
                .map(CouponMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponse applyCoupon(
            String couponCode,
            BigDecimal orderAmount) {

        Coupon coupon = couponRepository
                .findByCouponCodeIgnoreCase(couponCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Coupon not found"));

        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new ResourceNotFoundException("Coupon inactive");
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new ResourceNotFoundException("Coupon expired");
        }

        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new ResourceNotFoundException("Coupon usage limit exceeded");
        }

        if (orderAmount.compareTo(
                coupon.getMinimumOrderAmount()) < 0) {

            throw new ResourceNotFoundException(
                    "Minimum order amount not reached");
        }

        BigDecimal discount;

        if (coupon.getCouponType() == CouponType.FLAT) {

            discount = coupon.getDiscountValue();

        } else {

            discount = orderAmount
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));

            if (coupon.getMaximumDiscount() != null &&
                    discount.compareTo(
                            coupon.getMaximumDiscount()) > 0) {

                discount = coupon.getMaximumDiscount();
            }
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);

        couponRepository.save(coupon);

        return CouponResponse.builder()
                .id(coupon.getId())
                .couponCode(coupon.getCouponCode())
                .title(coupon.getTitle())
                .description("Discount Applied : " + discount)
                .couponType(coupon.getCouponType())
                .discountValue(discount)
                .minimumOrderAmount(coupon.getMinimumOrderAmount())
                .maximumDiscount(coupon.getMaximumDiscount())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .expiryDate(coupon.getExpiryDate())
                .status(coupon.getStatus())
                .build();
    }

    @Override
    public void deleteCoupon(Long couponId) {

        couponRepository.deleteById(couponId);
    }

}