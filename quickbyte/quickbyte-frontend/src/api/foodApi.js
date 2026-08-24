import api from "./axios";

export const getFoodsByCategory = (
  categoryId,
  params = {}
) =>
  api.get("/foods", {
    params: {
      categoryId,
      ...params,
    },
  });

export const searchFoods = (
  params = {}
) =>
  api.get("/foods/search", {
    params,
  });

export const getFood = (id) =>
  api.get(`/foods/${id}`);

export const getFoodVariants = (foodId) =>
  api.get(`/food-variants/food/${foodId}`);

export const getFoodAddons = (foodId) =>
  api.get(`/food-addons/food/${foodId}`);

export const getFoodImages = (foodId) =>
  api.get(`/food-images/food/${foodId}`);