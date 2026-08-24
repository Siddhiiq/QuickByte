package com.quickbyte.dto.Response;

import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTimingResponse {

    private Long id;

    private Long restaurantId;

    private DayOfWeek dayOfWeek;

    private LocalTime openingTime;

    private LocalTime closingTime;

    private Boolean closed;
}
