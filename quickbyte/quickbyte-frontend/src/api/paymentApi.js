import api from "./axios";

/*
 * Create payment record
 */
export const createPayment = (data) =>
  api.post("/payments", data);

/*
 * Get payment by order
 */
export const getPayment = (orderId) =>
  api.get(`/payments/${orderId}`);

/*
 * Mark payment successful
 *
 * Used for the current development/mock
 * payment flow.
 *
 * Later this endpoint can be called by
 * the real payment gateway verification flow.
 */
export const markPaymentSuccess = (
  orderId,
  transactionId,
  gatewayPaymentId
) =>
  api.put(
    `/payments/${orderId}/success`,
    null,
    {
      params: {
        transactionId,
        gatewayPaymentId
      }
    }
  );

/*
 * Mark payment failed
 */
export const markPaymentFailed = (
  orderId,
  reason
) =>
  api.put(
    `/payments/${orderId}/failed`,
    null,
    {
      params: {
        reason
      }
    }
  );