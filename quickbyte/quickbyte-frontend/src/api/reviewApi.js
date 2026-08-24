import api from "./axios";

export const addReview = (data) => api.post("/reviews", data);
export const getRestaurantReviews = (restaurantId) => api.get(`/reviews/restaurant/${restaurantId}`);
export const getFoodReviews = (foodId) => api.get(`/reviews/food/${foodId}`);
export const getCustomerReviews = (customerId) => api.get(`/reviews/customer/${customerId}`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
