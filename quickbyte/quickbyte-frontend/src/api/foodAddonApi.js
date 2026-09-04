import api from "./axios";

export const getFoodAddonsByFood = (foodId) =>
    api.get(`/food-addons/food/${foodId}`);

export const getFoodAddon = (id) =>
    api.get(`/food-addons/${id}`);

export const createFoodAddon = (data) =>
    api.post("/food-addons", data);

export const updateFoodAddon = (id, data) =>
    api.put(`/food-addons/${id}`, data);

export const deleteFoodAddon = (id) =>
    api.delete(`/food-addons/${id}`);