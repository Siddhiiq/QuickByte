import api from "./axios";


/*
================================
GET ALL USERS
ADMIN ONLY
================================
*/

export const getAllUsers = () => {

    return api.get(
        "/users"
    );

};