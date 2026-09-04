import api from "./axios";


/* =========================
   DELIVERY PARTNERS
========================= */

export const getAvailablePartners =
    () =>
        api.get(
            "/delivery/available"
        );


export const getDelivery =
    (partnerId) =>
        api.get(
            `/delivery/${partnerId}`
        );


/* =========================
   DELIVERY MANAGEMENT
========================= */

export const assignDeliveryPartner =
    (
        orderId,
        deliveryPartnerId
    ) =>
        api.post(
            "/delivery/assign",
            {
                orderId,
                deliveryPartnerId,
            }
        );


export const updateDeliveryStatus =
    (
        partnerId,
        status
    ) =>
        api.put(
            `/delivery/${partnerId}/status`,
            null,
            {
                params: {
                    status,
                },
            }
        );


/* =========================
   DELIVERY PARTNER MANAGEMENT
========================= */

export const createDeliveryPartner =
    (data) =>
        api.post(
            "/delivery-partners",
            data
        );