package com.quickbyte.controller;

import com.quickbyte.dto.Request.DeliveryRequest;
import com.quickbyte.dto.Response.DeliveryResponse;
import com.quickbyte.enums.DeliveryStatus;
import com.quickbyte.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService
            deliveryService;


    /*
     * ASSIGN ORDER
     */
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public DeliveryResponse assignOrder(
            @Valid
            @RequestBody
            DeliveryRequest request) {

        return deliveryService.assignOrder(
                request
        );
    }


    /*
     * UPDATE DELIVERY STATUS
     */
    @PutMapping("/{partnerId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public DeliveryResponse updateStatus(

            @PathVariable
            Long partnerId,

            @RequestParam
            DeliveryStatus status) {

        return deliveryService
                .updateDeliveryStatus(
                        partnerId,
                        status
                );
    }


    /*
     * GET ONE DELIVERY PARTNER
     */
    @GetMapping("/{partnerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public DeliveryResponse getDelivery(

            @PathVariable
            Long partnerId) {

        return deliveryService
                .getDelivery(
                        partnerId
                );
    }


    /*
     * GET AVAILABLE PARTNERS
     */
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DeliveryResponse>
    getAvailablePartners() {

        return deliveryService
                .getAvailablePartners();
    }


    /*
     * GET ACTIVE DELIVERIES
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DeliveryResponse>
    getActiveDeliveries() {

        return deliveryService
                .getActiveDeliveries();
    }
}