package com.quickbyte.dto.Response;

import com.quickbyte.enums.VariantType;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodVariantResponse {

    private Long id;

    private VariantType variantType;

    private BigDecimal price;

    private Integer stock;

    private Boolean available;

    private Long foodId;

    private String foodName;

}