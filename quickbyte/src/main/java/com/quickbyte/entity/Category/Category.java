package com.quickbyte.entity.Category;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.enums.CategoryStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_restaurant_category_name",
                        columnNames = {
                                "restaurant_id",
                                "name"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoryStatus status;

    /*
     * One Restaurant
     *      ↓
     * Many Categories
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "restaurant_id",
            nullable = false
    )
    private Restaurant restaurant;

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = CategoryStatus.ACTIVE;
        }

        if (displayOrder == null) {
            displayOrder = 1;
        }

    }

}