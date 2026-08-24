package com.quickbyte.dto.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTimingRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    private LocalTime openingTime;

    private LocalTime closingTime;

    @Builder.Default
    private Boolean closed = false;
}