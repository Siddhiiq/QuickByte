package com.quickbyte.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;

    private Long customerId;

    private String customerName;

    private Long restaurantId;

    private String restaurantName;

    private Long foodId;

    private String foodName;

    private Integer rating;

    private String review;

}