package com.quickbyte.dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long foodId;

    @NotNull
    private Long variantId;

    @NotNull
    @Min(1)
    private Integer quantity;
}