package com.quickbyte.dto.Request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodImageRequest {

    @NotNull
    private Long foodId;

    @NotBlank
    private String imageUrl;

    private Boolean thumbnail;

    private Integer displayOrder;

}