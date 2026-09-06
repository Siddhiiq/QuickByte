package com.quickbyte.mapper;

import com.quickbyte.dto.Response.CartItemResponse;
import com.quickbyte.dto.Response.CartResponse;
import com.quickbyte.entity.Cart.Cart;
import com.quickbyte.entity.Cart.CartItem;
import com.quickbyte.entity.Food.FoodImage;

import java.util.Comparator;
import java.util.List;

public class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getCartItems()
                        .stream()
                        .map(CartMapper::toItemResponse)
                        .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .customerName(cart.getUser().getFullName())
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getTotalItems())
                .items(items)
                .build();
    }

    private static CartItemResponse toItemResponse(
            CartItem item) {

        String imageUrl = null;

        if (item.getFood().getImages() != null) {

            imageUrl =
                    item.getFood()
                            .getImages()
                            .stream()

                            /*
                             * First priority:
                             * thumbnail image
                             */
                            .filter(FoodImage::getThumbnail)

                            /*
                             * If multiple thumbnails exist,
                             * use the lowest display order.
                             */
                            .min(
                                    Comparator.comparing(
                                            FoodImage::getDisplayOrder
                                    )
                            )

                            .map(
                                    FoodImage::getImageUrl
                            )

                            /*
                             * If no thumbnail exists,
                             * use the first image based
                             * on display order.
                             */
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