import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {

  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role restricted page
  if (
    roles?.length &&
    (!user?.role || !roles.includes(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}