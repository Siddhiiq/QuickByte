package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long id;

    private Long foodId;

    private String foodName;

    private Long variantId;

    private String variantType;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;
}