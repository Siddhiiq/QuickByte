package com.quickbyte.repository;

import com.quickbyte.entity.Order.OrderAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderAddressRepository
        extends JpaRepository<OrderAddress, Long> {

}