package com.quickbyte.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantImageRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @Builder.Default
    private Boolean thumbnail = false;

    @NotNull(message = "Display order is required")
    @Positive(message = "Display order must be greater than 0")
    private Integer displayOrder;
}