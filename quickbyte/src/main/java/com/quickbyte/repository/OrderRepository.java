package com.quickbyte.repository;

import com.quickbyte.entity.Order.Order;
import com.quickbyte.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByOrderStatus(OrderStatus status);

    @Query("""
SELECT COALESCE(SUM(o.grandTotal), 0)
FROM Order o
""")
    BigDecimal getTotalRevenue();
}