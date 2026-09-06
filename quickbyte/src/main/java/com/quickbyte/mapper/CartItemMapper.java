package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CartItemResponse;
import com.quickbyte.entity.Cart.CartItem;
import com.quickbyte.entity.Food.FoodImage;

import java.util.Comparator;

public class CartItemMapper {

    private CartItemMapper() {
    }

    public static CartItemResponse toResponse(
            CartItem item) {

        String imageUrl = null;

        if (item.getFood().getImages() != null) {

            imageUrl =
                    item.getFood()
                            .getImages()
                            .stream()

                            .filter(FoodImage::getThumbnail)

                            .min(
                                    Comparator.comparing(
                                            FoodImage::getDisplayOrder
                                    )
                            )

                            .map(
                                    FoodImage::getImageUrl
                            )

                            .orElseGet(() ->
                                    item.getFood()
                                            .getImages()
                                            .stream()

                                            .filter(image ->
                                                    image.getImageUrl()
                                                            != null
                                            )

                                            .min(
                                                    Comparator.comparing(
                                                            FoodImage::getDisplayOrder
                                                    )
                                            )

                                            .map(
                                                    FoodImage::getImageUrl
                                            )

                                            .orElse(null)
                            );
        }

        return CartItemResponse.builder()
                .id(item.getId())
                .foodId(item.getFood().getId())
                .foodName(item.getFood().getName())
                .imageUrl(imageUrl)
                .variantId(item.getVariant().getId())
                .variantType(
                        item.getVariant()
                                .getVariantType()
                                .name()
                )
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}