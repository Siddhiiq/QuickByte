import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowLeft,
    ClipboardList,
    Search,
    ShoppingBag,
    Clock3,
    CheckCircle2,
    XCircle,
    IndianRupee,
    User,
    Eye,
    RefreshCw,
    ChefHat,
} from "lucide-react";

import {
    getRestaurantOrders,
    updateOrderStatus,
} from "../api/orderApi";

import {
    getMyRestaurants,
} from "../api/restaurantApi";

import Loading from "../components/Loading";


export default function OwnerOrders() {

    const [restaurant, setRestaurant] =
        useState(null);

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [updatingOrderId, setUpdatingOrderId] =
        useState(null);


    useEffect(() => {

        loadOwnerOrders();

    }, []);


    const loadOwnerOrders =
        async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * STEP 1:
                 * Get restaurants owned
                 * by logged-in owner
                 */
                const restaurantResponse =
                    await getMyRestaurants();

                const restaurantData =
                    restaurantResponse.data ||
                    [];

                const restaurants =
                    Array.isArray(
                        restaurantData
                    )
                        ? restaurantData
                        : restaurantData.content ||
                        [];

                if (!restaurants.length) {

                    setRestaurant(null);
                    setOrders([]);

                    return;

                }

                /*
                 * Currently using the first
                 * restaurant.
                 */
                const ownerRestaurant =
                    restaurants[0];

                setRestaurant(
                    ownerRestaurant
                );


                /*
                 * STEP 2:
                 * Get orders for this restaurant
                 */
                const orderResponse =
                    await getRestaurantOrders(
                        ownerRestaurant.id
                    );

                const orderData =
                    orderResponse.data?.content ||
                    orderResponse.data ||
                    [];

                setOrders(
                    Array.isArray(orderData)
                        ? orderData
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load restaurant orders:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load restaurant orders."
                );

            } finally {

                setLoading(false);

            }

        };


    /*
     * UPDATE ORDER STATUS
     */
    const handleStatusUpdate =
        async (
            orderId,
            status
        ) => {

            try {

                setUpdatingOrderId(
                    orderId
                );

                setError("");

                await updateOrderStatus(
                    orderId,
                    status
                );

                /*
                 * Reload orders after
                 * successful update
                 */
                await loadOwnerOrders();

            } catch (error) {

                console.error(
                    "Failed to update order status:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to update order status."
                );

            } finally {

                setUpdatingOrderId(
                    null
                );

            }

        };


    /*
     * SEARCH ORDERS
     */
    const filteredOrders =
        useMemo(() => {

            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!query) {
                return orders;
            }

            return orders.filter(
                (order) => {

                    const orderId =
                        String(
                            order.id || ""
                        ).toLowerCase();

                    const customerName =
                        String(
                            order.customerName ||
                            order.customer?.fullName ||
                            ""
                        ).toLowerCase();

                    const status =
                        String(
                            order.orderStatus ||
                            ""
                        ).toLowerCase();

                    return (
                        orderId.includes(query) ||
                        customerName.includes(query) ||
                        status.includes(query)
                    );

                }
            );

        }, [
            orders,
            searchQuery,
        ]);


    /*
     * FORMAT STATUS
     */
    const formatStatus =
        (status) =>
            String(
                status || "PENDING"
            ).replaceAll(
                "_",
                " "
            );


    /*
     * STATUS STYLE
     */
    const getStatusClass =
        (status) => {

            const normalizedStatus =
                String(
                    status || ""
                ).toUpperCase();

            if (
                normalizedStatus ===
                "DELIVERED" ||
                normalizedStatus ===
                "COMPLETED"
            ) {

                return "admin-status approved";

            }

            if (
                normalizedStatus ===
                "CANCELLED" ||
                normalizedStatus ===
                "FAILED"
            ) {

                return "admin-status rejected";

            }

            return "admin-status pending";

        };


    /*
     * STATUS ICON
     */
    const getStatusIcon =
        (status) => {

            const normalizedStatus =
                String(
                    status || ""
                ).toUpperCase();

            if (
                normalizedStatus ===
                "DELIVERED" ||
                normalizedStatus ===
                "COMPLETED"
            ) {

                return (
                    <CheckCircle2
                        size={16}
                    />
                );

            }

            if (
                normalizedStatus ===
                "CANCELLED" ||
                normalizedStatus ===
                "FAILED"
            ) {

                return (
                    <XCircle
                        size={16}
                    />
                );

            }

            return (
                <Clock3
                    size={16}
                />
            );

        };


    /*
     * NEXT ORDER ACTION
     */
    const getNextStatus =
        (status) => {

            const current =
                String(
                    status || ""
                ).toUpperCase();

            switch (current) {

                case "PENDING":

                    return {
                        label:
                            "Accept Order",
                        status:
                            "CONFIRMED",
                    };

                case "CONFIRMED":

                    return {
                        label:
                            "Start Preparing",
                        status:
                            "PREPARING",
                    };

                case "PREPARING":

                    return {
                        label:
                            "Ready for Pickup",
                        status:
                            "READY_FOR_PICKUP",
                    };

                default:

                    return null;

            }

        };


    if (loading) {

        return <Loading />;

    }


    return (

        <main className="admin-page">


            {/* =========================
                PAGE HEADER
            ========================= */}

            <section className="admin-page-header">

                <div>

                    <Link
                        to="/owner"
                        className="admin-back-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Dashboard

                    </Link>


                    <span className="admin-page-eyebrow">

                        RESTAURANT ORDERS

                    </span>


                    <h1>

                        Order Management

                    </h1>


                    <p>

                        Manage incoming customer orders
                        for your restaurant.

                    </p>

                </div>


                <div className="admin-page-stat">

                    <ShoppingBag size={22} />

                    <div>

                        <strong>

                            {orders.length}

                        </strong>

                        <span>

                            Total Orders

                        </span>

                    </div>

                </div>

            </section>


            {/* =========================
                RESTAURANT INFO
            ========================= */}

            {restaurant && (

                <section className="admin-content-card">

                    <div className="admin-content-toolbar">

                        <div>

                            <span className="admin-page-eyebrow">

                                YOUR RESTAURANT

                            </span>

                            <h2>

                                {restaurant.name}

                            </h2>

                        </div>


                        <button
                            type="button"
                            className="primary"
                            onClick={
                                loadOwnerOrders
                            }
                        >

                            <RefreshCw size={17} />

                            Refresh

                        </button>

                    </div>

                </section>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="admin-error">

                    <XCircle size={19} />

                    <span>

                        {error}

                    </span>

                </div>

            )}


            {/* =========================
                ORDERS
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            Incoming Orders

                        </h2>

                        <p>

                            Accept and manage
                            customer orders.

                        </p>

                    </div>


                    <div className="admin-search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search order or customer..."
                            value={
                                searchQuery
                            }
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* =========================
                    NO RESTAURANT
                ========================= */}

                {!restaurant && (

                    <div className="admin-empty-state">

                        <ChefHat size={42} />

                        <h3>

                            No restaurant found

                        </h3>

                        <p>

                            Create your restaurant first
                            before managing orders.

                        </p>

                    </div>

                )}


                {/* =========================
                    EMPTY ORDERS
                ========================= */}

                {restaurant &&
                    filteredOrders.length === 0 && (

                        <div className="admin-empty-state">

                            <ClipboardList
                                size={42}
                            />

                            <h3>

                                No orders found

                            </h3>

                            <p>

                                {searchQuery
                                    ? "Try a different search."
                                    : "Customer orders will appear here."
                                }

                            </p>

                        </div>

                    )}


                {/* =========================
                    ORDER LIST
                ========================= */}

                {restaurant &&
                    filteredOrders.length > 0 && (

                        <div className="admin-restaurant-grid">

                            {filteredOrders.map(
                                (order) => {

                                    const orderStatus =
                                        order.orderStatus ||
                                        "PENDING";

                                    const nextAction =
                                        getNextStatus(
                                            orderStatus
                                        );

                                    const total =
                                        order.grandTotal ??
                                        order.totalAmount ??
                                        order.total ??
                                        "-";


                                    return (

                                        <div
                                            key={
                                                order.id
                                            }
                                            className="admin-restaurant-card"
                                        >


                                            {/* TOP */}

                                            <div className="admin-restaurant-card-top">

                                                <div className="admin-restaurant-icon">

                                                    <ShoppingBag
                                                        size={24}
                                                    />

                                                </div>


                                                <span
                                                    className={
                                                        getStatusClass(
                                                            orderStatus
                                                        )
                                                    }
                                                >

                                                    {getStatusIcon(
                                                        orderStatus
                                                    )}

                                                    {formatStatus(
                                                        orderStatus
                                                    )}

                                                </span>

                                            </div>


                                            {/* ORDER INFO */}

                                            <div className="admin-restaurant-info">

                                                <h3>

                                                    Order #
                                                    {order.id}

                                                </h3>


                                                <p>

                                                    <User
                                                        size={14}
                                                    />

                                                    {order.customerName ||
                                                        order.customer?.fullName ||
                                                        "Customer"
                                                    }

                                                </p>

                                            </div>


                                            {/* TOTAL */}

                                            <div className="admin-restaurant-details">

                                                <span>

                                                    <IndianRupee
                                                        size={15}
                                                    />

                                                    {total}

                                                </span>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="admin-restaurant-footer">


                                                {/* VIEW DETAILS */}

                                                <Link
                                                    to={
                                                        `/orders/${order.id}`
                                                    }
                                                >

                                                    View details

                                                    <Eye
                                                        size={17}
                                                    />

                                                </Link>


                                                {/* UPDATE STATUS */}

                                                {nextAction && (

                                                    <button
                                                        type="button"
                                                        className="primary"
                                                        disabled={
                                                            updatingOrderId ===
                                                            order.id
                                                        }
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                order.id,
                                                                nextAction.status
                                                            )
                                                        }
                                                    >

                                                        {updatingOrderId ===
                                                        order.id
                                                            ? "Updating..."
                                                            : nextAction.label
                                                        }

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

            </section>

        </main>

    );

}