import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const login = (payload) => {

    console.log("LOGIN RESPONSE:", payload);

    const token =
      payload?.accessToken ||
      payload?.token;

    if (!token) {
      console.error("No access token found in login response");
      return;
    }

    localStorage.setItem("accessToken", token);

    const savedUser = {
      id: payload?.userId ?? null,
      email: payload?.email ?? "",
      role: payload?.role ?? "CUSTOMER"
    };

    localStorage.setItem(
      "user",
      JSON.stringify(savedUser)
    );

    setUser(savedUser);
    setIsAuthenticated(true);

    console.log("Logged in user:", savedUser);
  };

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {

    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);