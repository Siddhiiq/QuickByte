import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
                                         children,
                                         roles,
                                       }) {

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const location =
      useLocation();

  console.log(
      "PROTECTED ROUTE:",
      {
        path: location.pathname,
        isAuthenticated,
        user,
        userRole: user?.role,
        allowedRoles: roles,
      }
  );

  // Not logged in
  if (!isAuthenticated) {

    return (
        <Navigate
            to="/login"
            replace
            state={{
              from: location.pathname,
            }}
        />
    );

  }

  // Role restricted page
  if (
      roles?.length &&
      (
          !user?.role ||
          !roles.includes(user.role)
      )
  ) {

    console.log(
        "ACCESS DENIED - ROLE MISMATCH"
    );

    return (
        <Navigate
            to="/"
            replace
        />
    );

  }

  return children;
}