import api from "./axios";

export const getRestaurantTimings = (restaurantId) =>
    api.get(`/restaurant-timings/restaurant/${restaurantId}`);

export const getRestaurantTiming = (timingId) =>
    api.get(`/restaurant-timings/${timingId}`);

export const createRestaurantTiming = (data) =>
    api.post("/restaurant-timings", data);

export const updateRestaurantTiming = (timingId, data) =>
    api.put(`/restaurant-timings/${timingId}`, data);

export const deleteRestaurantTiming = (timingId) =>
    api.delete(`/restaurant-timings/${timingId}`);