package com.quickbyte.dto.Request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartAddonRequest {

    @NotNull
    private Long cartItemId;

    @NotNull
    private Long foodAddonId;

}