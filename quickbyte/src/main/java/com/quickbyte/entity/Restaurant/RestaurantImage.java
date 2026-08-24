package com.quickbyte.entity.Restaurant;

import com.quickbyte.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantImage extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean thumbnail = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @PrePersist
    public void prePersist() {

        if (thumbnail == null) {
            thumbnail = false;
        }

        if (displayOrder == null) {
            displayOrder = 1;
        }
    }
}