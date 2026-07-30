package com.quickbyte.entity.Food;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.enums.VariantType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;


@Entity
@Table(name = "food_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodVariant extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VariantType variantType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean available;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;

    @PrePersist
    public void prePersist() {

        if (available == null) {
            available = true;
        }

        if (stock == null) {
            stock = 0;
        }

    }

}