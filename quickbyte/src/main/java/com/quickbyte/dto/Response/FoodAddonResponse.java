package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodAddonResponse {

    private Long id;

    private Long foodId;

    private String foodName;

    private String name;

    private BigDecimal price;

    private Boolean available;

    private Integer displayOrder;
}