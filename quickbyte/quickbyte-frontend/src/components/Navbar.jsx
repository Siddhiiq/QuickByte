import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Store,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">

      <Link to="/" className="brand">
        <span className="brand-mark">
          Q
        </span>

        <span>
          Quick<span>Byte</span>
        </span>
      </Link>

      <nav className="navlinks">

        <Link to="/">
          Home
        </Link>

        <Link to="/">
          Restaurants
        </Link>

        {user && user.role === "CUSTOMER" && (
          <>
            <Link to="/orders">
              <Package size={17} />
              Orders
            </Link>

            <Link to="/cart" className="cart-link">
              <ShoppingCart size={17} />
              Cart

              {itemCount > 0 && (
                <span className="cart-count">
                  {itemCount}
                </span>
              )}
            </Link>
          </>
        )}

        {user && user.role === "RESTAURANT_OWNER" && (
          <Link to="/owner">
            <Store size={17} />
            Owner
          </Link>
        )}

        {user && user.role === "ADMIN" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        {user ? (
          <>
            <Link to="/profile">
              <User size={17} />
              Profile
            </Link>

            <button
              className="linkButton logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              to="/register"
              className="nav-register"
            >
              Register
            </Link>
          </>
        )}

      </nav>

    </header>
  );
}