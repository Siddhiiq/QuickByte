package com.quickbyte.dto.Response;

import com.quickbyte.enums.CategoryStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;

    private Long restaurantId;

    private String restaurantName;

    private String name;

    private String description;

    private Integer displayOrder;

    private CategoryStatus status;

}
