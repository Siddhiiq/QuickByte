package com.quickbyte.entity.Delivery;

import com.quickbyte.common.BaseEntity;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "delivery_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPartner extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean available;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus deliveryStatus;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @PrePersist
    public void prePersist() {

        if (available == null) {
            available = true;
        }

        if (deliveryStatus == null) {
            deliveryStatus = DeliveryStatus.AVAILABLE;
        }
    }
}