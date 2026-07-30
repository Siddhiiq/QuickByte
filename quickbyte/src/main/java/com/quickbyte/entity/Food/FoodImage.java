package com.quickbyte.entity.Food;

import com.quickbyte.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodImage extends BaseEntity {

    @Column(nullable = false,length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean thumbnail;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id",nullable = false)
    private Food food;

    @PrePersist
    public void prePersist(){

        if(thumbnail==null){
            thumbnail=false;
        }

        if(displayOrder==null){
            displayOrder=1;
        }

    }

}