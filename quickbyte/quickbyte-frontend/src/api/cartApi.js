import api from "./axios";

/*
 * Get user's cart
 */
export const getCart = (userId) =>
  api.get(`/cart/${userId}`);


/*
 * Add item to cart
 */
export const addToCart = (data) =>
  api.post("/cart/items", data);


/*
 * Alias used by CartContext
 */
export const addItemToCart = (data) =>
  api.post("/cart/items", data);


/*
 * Update item quantity
 */
export const updateCartItem = (cartItemId, userId, quantity) =>
  api.put(`/cart/items/${cartItemId}`, null, {
    params: {
      userId: userId,
      quantity: quantity,
    },
  });

/*
 * Remove one cart item
 */
export const removeCartItem = (
  cartItemId,
  userId
) =>
  api.delete(
    `/cart/items/${cartItemId}`,
    {
      params: {
        userId,
      },
    }
  );


/*
 * Clear entire backend cart
 */
export const clearCart = (userId) =>
  api.delete(`/cart/clear/${userId}`);


/*
 * Alias used by CartContext
 */
export const clearBackendCart = (userId) =>
  api.delete(`/cart/clear/${userId}`);