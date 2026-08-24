package com.quickbyte.controller;

import com.quickbyte.dto.Request.DeliveryPartnerRequest;
import com.quickbyte.entity.Delivery.DeliveryPartner;
import com.quickbyte.repository.DeliveryPartnerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/delivery-partners")
@RequiredArgsConstructor
public class DeliveryPartnerController {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeliveryPartner createPartner(
            @Valid @RequestBody DeliveryPartnerRequest request) {

        DeliveryPartner partner = DeliveryPartner.builder()
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .available(true)
                .deliveryStatus(
                        com.quickbyte.enums.DeliveryStatus.ASSIGNED)
                .order(null)
                .build();

        return deliveryPartnerRepository.save(partner);
    }

    @GetMapping("/{id}")
    public DeliveryPartner getPartner(
            @PathVariable Long id) {

        return deliveryPartnerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Delivery Partner not found"));
    }
}