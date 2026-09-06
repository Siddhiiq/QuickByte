import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* =========================
   PUBLIC PAGES
========================= */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import CategoryPage from "./pages/CategoryPage";
import FoodDetails from "./pages/FoodDetails";
import OnlinePayment from "./pages/OnlinePayment";
import NotFound from "./pages/NotFound";

/* =========================
   CUSTOMER PAGES
========================= */

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";

/* =========================
   RESTAURANT OWNER PAGES
========================= */

import OwnerDashboard from "./pages/OwnerDashboard";
import RestaurantManagement from "./pages/RestaurantManagement";
import CategoryManagement from "./pages/CategoryManagement";
import FoodManagement from "./pages/FoodManagement";
import VariantManagement from "./pages/VariantManagement";
import AddonManagement from "./pages/AddonManagement";
import OwnerImages from "./pages/OwnerImages";
import OwnerTimings from "./pages/OwnerTimings";
import OwnerOrders from "./pages/OwnerOrders";

/* =========================
   ADMIN PAGES
========================= */

import AdminDashboard from "./pages/AdminDashboard";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminUsers from "./pages/AdminUsers";



export default function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
            PUBLIC ROUTES
        ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

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
            CUSTOMER ROUTES
        ========================= */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute
                            roles={["CUSTOMER"]}
                        >
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute
                            roles={["CUSTOMER"]}
                        >
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute
                            roles={["CUSTOMER"]}
                        >
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                {/* CUSTOMER ORDER DETAILS */}
                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute
                            roles={[
                                "CUSTOMER",
                                "RESTAURANT_OWNER",
                                "ADMIN",
                            ]}
                        >
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
            RESTAURANT OWNER ROUTES
        ========================= */}

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/restaurant"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <RestaurantManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/categories"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <CategoryManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/foods"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <FoodManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/variants"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <VariantManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/addons"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <AddonManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/images"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <OwnerImages />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/timings"
                    element={
                        <ProtectedRoute
                            roles={["RESTAURANT_OWNER"]}
                        >
                            <OwnerTimings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/orders"
                    element={
                        <ProtectedRoute
                            roles={[
                                "RESTAURANT_OWNER",
                            ]}
                        >
                            <OwnerOrders />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
            ADMIN ROUTES
        ========================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            roles={["ADMIN"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/restaurants"
                    element={
                        <ProtectedRoute
                            roles={["ADMIN"]}
                        >
                            <AdminRestaurants />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute
                            roles={["ADMIN"]}
                        >
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders/:id"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <AdminOrderDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                {/* TEMPORARY:
            Replace AdminOrders with AdminDeliveries
            when you create that page.
        */}
                <Route
                    path="/admin/deliveries"
                    element={
                        <ProtectedRoute
                            roles={["ADMIN"]}
                        >
                            <AdminDeliveries />
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