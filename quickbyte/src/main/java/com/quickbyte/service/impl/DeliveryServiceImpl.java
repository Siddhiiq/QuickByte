package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.DeliveryRequest;
import com.quickbyte.dto.Response.DeliveryResponse;
import com.quickbyte.entity.Delivery.DeliveryPartner;
import com.quickbyte.entity.Order.Order;
import com.quickbyte.enums.DeliveryStatus;
import com.quickbyte.enums.OrderStatus;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.DeliveryMapper;
import com.quickbyte.repository.DeliveryPartnerRepository;
import com.quickbyte.repository.OrderRepository;
import com.quickbyte.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl
        implements DeliveryService {

    private final DeliveryPartnerRepository
            deliveryPartnerRepository;

    private final OrderRepository
            orderRepository;


    /*
     * ASSIGN ORDER TO DELIVERY PARTNER
     */
    @Override
    public DeliveryResponse assignOrder(
            DeliveryRequest request) {

        /*
         * Find delivery partner.
         */
        DeliveryPartner partner =
                deliveryPartnerRepository
                        .findById(
                                request.getDeliveryPartnerId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery Partner not found"
                                )
                        );


        /*
         * Find order.
         */
        Order order =
                orderRepository
                        .findById(
                                request.getOrderId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );


        /*
         * Only READY_FOR_PICKUP orders
         * can be assigned.
         */
        if (order.getOrderStatus()
                != OrderStatus.READY_FOR_PICKUP) {

            throw new IllegalStateException(
                    "Only orders ready for pickup "
                            + "can be assigned to a "
                            + "delivery partner"
            );
        }


        /*
         * Prevent assigning the same order
         * to multiple delivery partners.
         */
        if (deliveryPartnerRepository
                .existsByOrderId(order.getId())) {

            throw new IllegalStateException(
                    "This order is already assigned "
                            + "to a delivery partner"
            );
        }


        /*
         * Partner must be available.
         */
        if (!Boolean.TRUE.equals(
                partner.getAvailable()
        )) {

            throw new IllegalStateException(
                    "Delivery Partner is not available"
            );
        }


        /*
         * Assign order to partner.
         */
        partner.setOrder(order);


        /*
         * Partner is now busy.
         */
        partner.setAvailable(false);


        /*
         * Delivery is assigned.
         */
        partner.setDeliveryStatus(
                DeliveryStatus.ASSIGNED
        );


        /*
         * IMPORTANT:
         *
         * The order is no longer waiting
         * for a delivery partner.
         *
         * Therefore, change it from
         * READY_FOR_PICKUP to
         * OUT_FOR_DELIVERY.
         *
         * This makes the order disappear
         * from the Ready For Pickup section.
         */
        order.setOrderStatus(
                OrderStatus.OUT_FOR_DELIVERY
        );

        orderRepository.save(order);


        /*
         * Save assigned partner.
         */
        DeliveryPartner savedPartner =
                deliveryPartnerRepository
                        .save(partner);


        return DeliveryMapper.toResponse(
                savedPartner
        );
    }


    /*
     * UPDATE DELIVERY STATUS
     */
    @Override
    public DeliveryResponse updateDeliveryStatus(
            Long deliveryPartnerId,
            DeliveryStatus status) {

        /*
         * Find delivery partner.
         */
        DeliveryPartner partner =
                deliveryPartnerRepository
                        .findById(
                                deliveryPartnerId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery Partner not found"
                                )
                        );


        /*
         * Partner must have
         * an assigned order.
         */
        if (partner.getOrder() == null) {

            throw new IllegalStateException(
                    "No order is currently assigned "
                            + "to this delivery partner"
            );
        }


        Order order =
                partner.getOrder();


        /*
         * Cannot manually set AVAILABLE
         * while an order is assigned.
         */
        if (status ==
                DeliveryStatus.AVAILABLE) {

            throw new IllegalStateException(
                    "Cannot mark a delivery partner "
                            + "as AVAILABLE while an "
                            + "order is assigned"
            );
        }


        /*
         * PICKED_UP
         */
        if (status ==
                DeliveryStatus.PICKED_UP) {

            partner.setDeliveryStatus(
                    DeliveryStatus.PICKED_UP
            );


            /*
             * Order is being delivered.
             */
            order.setOrderStatus(
                    OrderStatus.OUT_FOR_DELIVERY
            );

            orderRepository.save(order);
        }


        /*
         * ON_THE_WAY
         */
        else if (status ==
                DeliveryStatus.ON_THE_WAY) {

            partner.setDeliveryStatus(
                    DeliveryStatus.ON_THE_WAY
            );


            /*
             * Order remains out for delivery.
             */
            order.setOrderStatus(
                    OrderStatus.OUT_FOR_DELIVERY
            );

            orderRepository.save(order);
        }


        /*
         * DELIVERED
         */
        else if (status ==
                DeliveryStatus.DELIVERED) {

            /*
             * Mark order as delivered.
             */
            order.setOrderStatus(
                    OrderStatus.DELIVERED
            );

            orderRepository.save(order);


            /*
             * Partner becomes available again.
             */
            partner.setAvailable(true);


            /*
             * Remove assigned order.
             */
            partner.setOrder(null);


            /*
             * Reset partner status
             * back to AVAILABLE.
             */
            partner.setDeliveryStatus(
                    DeliveryStatus.AVAILABLE
            );
        }


        /*
         * ASSIGNED
         */
        else if (status ==
                DeliveryStatus.ASSIGNED) {

            partner.setDeliveryStatus(
                    DeliveryStatus.ASSIGNED
            );
        }


        /*
         * Save updated delivery partner.
         */
        DeliveryPartner savedPartner =
                deliveryPartnerRepository
                        .save(partner);


        return DeliveryMapper.toResponse(
                savedPartner
        );
    }


    /*
     * GET DELIVERY PARTNER DETAILS
     */
    @Override
    public DeliveryResponse getDelivery(
            Long deliveryPartnerId) {

        DeliveryPartner partner =
                deliveryPartnerRepository
                        .findById(
                                deliveryPartnerId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery Partner not found"
                                )
                        );


        return DeliveryMapper.toResponse(
                partner
        );
    }


    /*
     * GET AVAILABLE DELIVERY PARTNERS
     */
    @Override
    public List<DeliveryResponse>
    getAvailablePartners() {

        return deliveryPartnerRepository
                .findByAvailableTrue()
                .stream()
                .map(
                        DeliveryMapper::toResponse
                )
                .toList();
    }


    /*
     * GET ACTIVE DELIVERIES
     */
    @Override
    public List<DeliveryResponse>
    getActiveDeliveries() {

        return deliveryPartnerRepository
                .findByAvailableFalse()
                .stream()
                .map(
                        DeliveryMapper::toResponse
                )
                .toList();
    }
}