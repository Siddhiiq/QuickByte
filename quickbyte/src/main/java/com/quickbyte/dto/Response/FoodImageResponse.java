package com.quickbyte.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodImageResponse {

    private Long id;

    private Long foodId;

    private String foodName;

    private String imageUrl;

    private Boolean thumbnail;

    private Integer displayOrder;

}