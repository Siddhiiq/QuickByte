import api from "./axios";

export const getCategoriesByRestaurant = (
  restaurantId,
  params = {}
) =>
  api.get("/categories", {
    params: {
      restaurantId,
      ...params,
    },
  });

export const searchCategories = (
  restaurantId,
  keyword,
  params = {}
) =>
  api.get("/categories/search", {
    params: {
      restaurantId,
      keyword,
      ...params,
    },
  });

export const getCategory = (id) =>
  api.get(`/categories/${id}`);

export const createCategory = (data) =>
  api.post("/categories", data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);