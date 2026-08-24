import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import FoodDetails from "./pages/FoodDetails";
import OnlinePayment from "./pages/OnlinePayment";

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================
            PUBLIC
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetails />}
        />

        <Route
          path="/restaurants/:restaurantId/categories"
          element={<CategoryPage />}
        />

        <Route
          path="/foods/:id"
          element={<FoodDetails />}
        />

        <Route
          path="/search"
          element={<Home />}
        />

        <Route
          path="/payment/:orderId"
          element={<OnlinePayment />}
        />


        {/* =========================
            CUSTOMER
        ========================= */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />


        {/* =========================
            COMMON AUTHENTICATED
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RESTAURANT OWNER
        ========================= */}

        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={["RESTAURANT_OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/deliveries"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Orders />
            </ProtectedRoute>
          }
        />


        {/* =========================
            404
        ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}