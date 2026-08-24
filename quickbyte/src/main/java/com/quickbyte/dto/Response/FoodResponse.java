package com.quickbyte.dto.Response;

import com.quickbyte.enums.FoodStatus;
import com.quickbyte.enums.FoodType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {

    private Long id;

    private String name;

    private String description;

    private FoodType foodType;

    private Integer preparationTime;

    private Boolean bestSeller;

    private Boolean recommended;

    private Double averageRating;

    private Integer totalReviews;

    private FoodStatus status;

    private Long categoryId;

    private String categoryName;

    // NEW
    private Double price;
}