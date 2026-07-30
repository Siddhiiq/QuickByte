package com.quickbyte.dto;

import com.quickbyte.enums.FoodType;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequest {

    @NotBlank(message = "Food name is required")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500)
    private String description;

    @NotNull(message = "Food type is required")
    private FoodType foodType;

    @NotNull(message = "Preparation time is required")
    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    private Integer preparationTime;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Builder.Default
    private Boolean bestSeller = false;

    @Builder.Default
    private Boolean recommended = false;

}