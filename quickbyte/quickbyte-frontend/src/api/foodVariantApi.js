import api from "./axios";

export const getVariantsByFood = (foodId) =>
    api.get(`/food-variants/food/${foodId}`);

export const getFoodVariant = (id) =>
    api.get(`/food-variants/${id}`);

export const createFoodVariant = (data) =>
    api.post("/food-variants", data);

export const updateFoodVariant = (id, data) =>
    api.put(`/food-variants/${id}`, data);

export const deleteFoodVariant = (id) =>
    api.delete(`/food-variants/${id}`);