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
    Store,
    User,
    Eye,
} from "lucide-react";

import {
    getAllOrders,
} from "../api/orderApi";

import Loading from "../components/Loading";


export default function AdminOrders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");


    useEffect(() => {

        loadOrders();

    }, []);


    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAllOrders();

            const data =
                response.data?.content ||
                response.data ||
                [];

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);

        }

    };


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

                    const restaurantName =
                        String(
                            order.restaurantName ||
                            order.restaurant?.name ||
                            ""
                        ).toLowerCase();

                    const orderStatus =
                        String(
                            order.orderStatus || ""
                        ).toLowerCase();

                    return (
                        orderId.includes(query) ||
                        customerName.includes(query) ||
                        restaurantName.includes(query) ||
                        orderStatus.includes(query)
                    );

                }
            );

        }, [
            orders,
            searchQuery,
        ]);


    const getStatusClass =
        (status) => {

            const normalizedStatus =
                String(
                    status || ""
                ).toUpperCase();

            if (
                normalizedStatus === "DELIVERED" ||
                normalizedStatus === "COMPLETED"
            ) {

                return "admin-status approved";

            }

            if (
                normalizedStatus === "CANCELLED" ||
                normalizedStatus === "FAILED"
            ) {

                return "admin-status rejected";

            }

            return "admin-status pending";

        };


    const getStatusIcon =
        (status) => {

            const normalizedStatus =
                String(
                    status || ""
                ).toUpperCase();

            if (
                normalizedStatus === "DELIVERED" ||
                normalizedStatus === "COMPLETED"
            ) {

                return (
                    <CheckCircle2 size={16} />
                );

            }

            if (
                normalizedStatus === "CANCELLED" ||
                normalizedStatus === "FAILED"
            ) {

                return (
                    <XCircle size={16} />
                );

            }

            return (
                <Clock3 size={16} />
            );

        };


    const formatStatus =
        (status) => {

            return String(
                status || "PENDING"
            ).replaceAll(
                "_",
                " "
            );

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
                        to="/admin"
                        className="admin-back-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Dashboard

                    </Link>


                    <span className="admin-page-eyebrow">

                        ORDER MANAGEMENT

                    </span>


                    <h1>

                        Orders

                    </h1>


                    <p>

                        Monitor and manage all orders
                        across the QuickByte platform.

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


                {/* =========================
                    TOOLBAR
                ========================= */}

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            All Orders

                        </h2>

                        <p>

                            Search and monitor customer orders.

                        </p>

                    </div>


                    <div className="admin-search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search order, customer or restaurant..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {filteredOrders.length === 0 ? (

                    <div className="admin-empty-state">

                        <ClipboardList size={42} />

                        <h3>

                            No orders found

                        </h3>

                        <p>

                            {searchQuery
                                ? "Try searching with a different order, customer or restaurant."
                                : "Orders will appear here once customers start placing them."
                            }

                        </p>

                    </div>

                ) : (

                    <div className="admin-restaurant-grid">

                        {filteredOrders.map(
                            (order) => {

                                const orderStatus =
                                    order.orderStatus ||
                                    "PENDING";


                                const customerName =
                                    order.customerName ||
                                    order.customer?.fullName ||
                                    "Customer";


                                const restaurantName =
                                    order.restaurantName ||
                                    order.restaurant?.name ||
                                    "Restaurant";


                                const total =
                                    order.grandTotal ??
                                    order.totalAmount ??
                                    order.total ??
                                    "-";


                                return (

                                    <Link
                                        key={order.id}
                                        to={`/admin/orders/${order.id}`}
                                        className="admin-restaurant-card"
                                    >


                                        {/* =========================
                                            TOP
                                        ========================= */}

                                        <div className="admin-restaurant-card-top">

                                            <div className="admin-restaurant-icon">

                                                <ShoppingBag size={24} />

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


                                        {/* =========================
                                            ORDER INFO
                                        ========================= */}

                                        <div className="admin-restaurant-info">

                                            <h3>

                                                Order #{order.id}

                                            </h3>


                                            <p>

                                                <User size={14} />

                                                {customerName}

                                            </p>

                                        </div>


                                        {/* =========================
                                            DETAILS
                                        ========================= */}

                                        <div className="admin-restaurant-details">

                                            <span>

                                                <Store size={15} />

                                                {restaurantName}

                                            </span>


                                            <span>

                                                <IndianRupee size={15} />

                                                {total}

                                            </span>

                                        </div>


                                        {/* =========================
                                            FOOTER
                                        ========================= */}

                                        <div className="admin-restaurant-footer">

                                            <span>

                                                View order details

                                            </span>

                                            <Eye size={17} />

                                        </div>

                                    </Link>

                                );

                            }
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}