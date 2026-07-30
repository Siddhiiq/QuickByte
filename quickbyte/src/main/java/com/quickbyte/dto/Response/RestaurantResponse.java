package com.quickbyte.dto.Response;

import com.quickbyte.enums.RestaurantStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {

    private Long id;

    private String name;

    private String description;

    private String email;

    private String phoneNumber;

    private RestaurantStatus status;

    // Address

    private String street;

    private String area;

    private String landmark;

    private String city;

    private String district;

    private String state;

    private String country;

    private String pincode;

    private Double latitude;

    private Double longitude;
}