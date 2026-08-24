package com.quickbyte.dto.Request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodImageRequest {

    @NotNull(message = "Food Id is required")
    private Long foodId;

    @NotBlank(message = "Image URL is required")
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    @NotNull(message = "Thumbnail status is required")
    private Boolean thumbnail;

    @NotNull(message = "Display order is required")
    @Positive(message = "Display order must be greater than 0")
    private Integer displayOrder;

}