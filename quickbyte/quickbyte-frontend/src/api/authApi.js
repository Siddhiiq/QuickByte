import api from "./axios";

export const loginApi = (data) =>
  api.post("/users/login", data);

export const registerApi = (data) =>
  api.post("/users/register", data);

export const refreshTokenApi = (data) =>
  api.post("/users/refresh-token", data);

export const logoutApi = (userId) =>
  api.post(`/users/logout?userId=${userId}`);