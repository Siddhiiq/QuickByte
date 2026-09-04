import axios from "axios";

const api = axios.create({
  baseURL:
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8080/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
    (response) => response,

    (error) => {
      const status = error.response?.status;

      /*
       * Only 401 means authentication is invalid/expired.
       *
       * 403 can also mean the user does not have permission,
       * so do NOT automatically log out on 403.
       */
      if (status === 401) {
        console.log("Authentication expired. Logging out...");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
);

export default api;