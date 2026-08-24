import api from "./axios";

export const getRestaurants = (params = {}) =>
  api.get("/restaurants", {
    params,
  });

export const searchRestaurants = (params = {}) =>
  api.get("/restaurants/search", {
    params,
  });

export const getMyRestaurant = () =>
  api.get("/restaurants/my");

export const getRestaurant = (id) =>
  api.get(`/restaurants/${id}`);

export const createRestaurant = (data) =>
  api.post("/restaurants", data);

export const updateRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data);

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`);