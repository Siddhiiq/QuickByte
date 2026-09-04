import api from "./axios";


/*
 * =========================
 * CREATE ORDER
 * =========================
 */
export const createOrder = (
    data
) =>
    api.post(
        "/orders",
        data
    );


/*
 * =========================
 * GET ALL ORDERS
 * ADMIN
 * =========================
 */
export const getAllOrders =
    () =>
        api.get(
            "/orders"
        );


/*
 * =========================
 * GET ORDER BY ID
 * =========================
 */
export const getOrder =
    (orderId) =>
        api.get(
            `/orders/${orderId}`
        );


/*
 * =========================
 * GET CUSTOMER ORDERS
 * =========================
 */
export const getCustomerOrders =
    (customerId) =>
        api.get(
            `/orders/customer/${customerId}`
        );


/*
 * =========================
 * GET RESTAURANT ORDERS
 * =========================
 */
export const getRestaurantOrders =
    (restaurantId) =>
        api.get(
            `/orders/restaurant/${restaurantId}`
        );


/*
 * =========================
 * UPDATE ORDER STATUS
 *
 * Backend:
 * PUT /orders/{orderId}/status
 * ?status=CONFIRMED
 * =========================
 */
export const updateOrderStatus =
    (
        orderId,
        status
    ) =>
        api.put(
            `/orders/${orderId}/status`,
            null,
            {
                params: {
                    status,
                },
            }
        );


/*
 * =========================
 * CANCEL ORDER
 * =========================
 */
export const cancelOrder =
    (orderId) =>
        api.delete(
            `/orders/${orderId}`
        );