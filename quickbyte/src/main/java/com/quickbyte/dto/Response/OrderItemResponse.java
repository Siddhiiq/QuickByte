package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long foodId;

    private String foodName;

    private String variant;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

}