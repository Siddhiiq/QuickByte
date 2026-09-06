import api from "./axios";


/*
================================
GET AVAILABLE DELIVERY PARTNERS
================================
*/

export const getAvailablePartners = () => {

    return api.get(
        "/delivery/available"
    );

};


/*
================================
GET ACTIVE DELIVERIES
================================
*/

export const getActiveDeliveries = () => {

    return api.get(
        "/delivery/active"
    );

};


/*
================================
GET DELIVERY BY PARTNER ID
================================
*/

export const getDelivery = (
    partnerId
) => {

    return api.get(
        `/delivery/${partnerId}`
    );

};


/*
================================
ASSIGN ORDER TO DELIVERY PARTNER
================================
*/

export const assignDelivery = (
    data
) => {

    return api.post(
        "/delivery/assign",
        data
    );

};


/*
================================
UPDATE DELIVERY STATUS
================================
*/

export const updateDeliveryStatus = (
    partnerId,
    status
) => {

    return api.put(

        `/delivery/${partnerId}/status`,

        null,

        {
            params: {
                status: status
            }
        }

    );

};