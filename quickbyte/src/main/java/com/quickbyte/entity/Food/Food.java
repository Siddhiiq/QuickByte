package com.quickbyte.entity.Food;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.enums.FoodStatus;
import com.quickbyte.enums.FoodType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import com.quickbyte.entity.Review.Review;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodType foodType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodStatus status;

    @Column(nullable = false)
    private Integer preparationTime;

    @Column(nullable = false)
    private Boolean bestSeller;

    @Column(nullable = false)
    private Boolean recommended;

    @Column(nullable = false)
    private Double averageRating;

    @Column(nullable = false)
    private Integer totalReviews;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /*
        Next Batch
     */
    @OneToMany(
            mappedBy = "food",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<FoodAddon> addons = new ArrayList<>();
    @OneToMany(
            mappedBy = "food",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<FoodImage> images = new ArrayList<>();
    @OneToMany(
            mappedBy = "food",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<FoodVariant> variants = new ArrayList<>();

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = FoodStatus.AVAILABLE;
        }

        if (bestSeller == null) {
            bestSeller = false;
        }

        if (recommended == null) {
            recommended = false;
        }

        if (averageRating == null) {
            averageRating = 0.0;
        }

        if (totalReviews == null) {
            totalReviews = 0;
        }

    }

}