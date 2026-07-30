package com.quickbyte.service.impl;

import com.quickbyte.dto.Response.AdminDashboardResponse;
import com.quickbyte.repository.OrderRepository;
import com.quickbyte.repository.RestaurantRepository;
import com.quickbyte.repository.UserRepository;
import com.quickbyte.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    @Override
    public AdminDashboardResponse getDashboard() {

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalRestaurants(restaurantRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.getTotalRevenue())
                .build();
    }
}