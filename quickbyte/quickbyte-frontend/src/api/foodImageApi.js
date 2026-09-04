import api from "./axios";

export const getFoodImages = (foodId) =>
    api.get(`/food-images/food/${foodId}`);

export const createFoodImage = (data) =>
    api.post("/food-images", data);

export const deleteFoodImage = (imageId) =>
    api.delete(`/food-images/${imageId}`);