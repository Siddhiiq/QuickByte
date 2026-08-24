package com.quickbyte.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantImageResponse {

    private Long id;

    private Long restaurantId;

    private String restaurantName;

    private String imageUrl;

    private Boolean thumbnail;

    private Integer displayOrder;
}