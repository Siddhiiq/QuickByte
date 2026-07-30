package com.quickbyte.dto.Request;

import com.quickbyte.enums.VariantType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodVariantRequest {

    @NotNull
    private Long foodId;

    @NotNull
    private VariantType variantType;

    @NotNull
    @Positive
    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;

}