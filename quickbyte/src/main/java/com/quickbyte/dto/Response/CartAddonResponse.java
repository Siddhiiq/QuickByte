package com.quickbyte.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartAddonResponse {

    private Long id;

    private Long cartItemId;

    private Long foodAddonId;

    private String addonName;

    private BigDecimal addonPrice;

}