import api from "./axios";

export const getRestaurantImages = (restaurantId) =>
    api.get(
        `/restaurant-images/restaurant/${restaurantId}`
    );

export const getRestaurantImage = (imageId) =>
    api.get(
        `/restaurant-images/${imageId}`
    );

export const createRestaurantImage = (data) =>
    api.post(
        "/restaurant-images",
        data
    );

export const updateRestaurantImage = (
    imageId,
    data
) =>
    api.put(
        `/restaurant-images/${imageId}`,
        data
    );

export const deleteRestaurantImage = (imageId) =>
    api.delete(
        `/restaurant-images/${imageId}`
    );