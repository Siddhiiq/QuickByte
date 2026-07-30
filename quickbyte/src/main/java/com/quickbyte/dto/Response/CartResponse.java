package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long id;

    private Long userId;

    private String customerName;

    private BigDecimal totalAmount;

    private Integer totalItems;

    private List<CartItemResponse> items;

}