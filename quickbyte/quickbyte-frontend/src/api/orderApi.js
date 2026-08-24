import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getCustomerOrders = (customerId) => api.get(`/orders/customer/${customerId}`);
export const getRestaurantOrders = (restaurantId) =>
  api.get(`/orders/restaurant/${restaurantId}`);
export const cancelOrder = (id) =>
  api.delete(`/orders/${id}`);