package com.quickbyte.repository;

import com.quickbyte.entity.Delivery.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryPartnerRepository
        extends JpaRepository<DeliveryPartner, Long> {

    List<DeliveryPartner> findByAvailableTrue();

    List<DeliveryPartner> findByAvailableFalse();


    boolean existsByOrderId(Long orderId);

}