package com.quickbyte.dto.Request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodAddonRequest {

    @NotNull(message = "Food Id is required")
    private Long foodId;

    @NotBlank(message = "Addon name is required")
    @Size(max = 100)
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    private Boolean available;

    private Integer displayOrder;
}