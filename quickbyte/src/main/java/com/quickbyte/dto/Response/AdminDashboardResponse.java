package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalRestaurants;

    private Long totalOrders;

    private BigDecimal totalRevenue;

}