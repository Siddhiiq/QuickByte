import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ClipboardList,
    User,
    Store,
    IndianRupee,
    MapPin,
    FileText,
    Package,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import {
    getOrder,
} from "../api/orderApi";

import Loading from "../components/Loading";


export default function AdminOrderDetails() {

    const { id } =
        useParams();

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadOrder();

    }, [id]);


    const loadOrder =
        async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getOrder(id);

                setOrder(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Failed to load order:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load order details."
                );

            } finally {

                setLoading(false);

            }

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


    if (loading) {

        return <Loading />;

    }


    if (error) {

        return (

            <main className="admin-page">

                <div className="admin-error">

                    <XCircle size={19} />

                    <span>

                        {error}

                    </span>

                </div>

            </main>

        );

    }


    if (!order) {

        return (

            <main className="admin-page">

                <div className="admin-empty-state">

                    <ClipboardList size={42} />

                    <h3>

                        Order not found

                    </h3>

                </div>

            </main>

        );

    }


    return (

        <main className="admin-page">


            {/* =========================
                HEADER
            ========================= */}

            <section className="admin-page-header">

                <div>

                    <Link
                        to="/admin/orders"
                        className="admin-back-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Orders

                    </Link>


                    <span className="admin-page-eyebrow">

                        ORDER DETAILS

                    </span>


                    <h1>

                        Order #{order.id}

                    </h1>


                    <p>

                        View complete order information
                        and customer details.

                    </p>

                </div>


                <span
                    className={
                        getStatusClass(
                            order.orderStatus
                        )
                    }
                >

                    {getStatusIcon(
                        order.orderStatus
                    )}

                    {formatStatus(
                        order.orderStatus
                    )}

                </span>

            </section>


            {/* =========================
                ORDER INFORMATION
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            Order Information

                        </h2>

                        <p>

                            Basic information about this order.

                        </p>

                    </div>

                </div>


                <div className="admin-restaurant-details">

                    <span>

                        <User size={16} />

                        {order.customerName ||
                            "Customer"}

                    </span>


                    <span>

                        <Store size={16} />

                        {order.restaurantName ||
                            "Restaurant"}

                    </span>


                    <span>

                        <IndianRupee size={16} />

                        ₹{order.grandTotal}

                    </span>

                </div>

            </section>


            {/* =========================
                ORDER ITEMS
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            <Package size={20} />

                            Order Items

                        </h2>

                        <p>

                            Items ordered by the customer.

                        </p>

                    </div>

                </div>


                {order.items?.length ? (

                    <div className="admin-restaurant-grid">

                        {order.items.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={
                                        item.id ||
                                        index
                                    }
                                    className="admin-restaurant-card"
                                >

                                    <div className="admin-restaurant-info">

                                        <h3>

                                            {item.foodName ||
                                                "Food Item"}

                                        </h3>

                                    </div>


                                    <div className="admin-restaurant-details">

                                        <span>

                                            Quantity:
                                            {" "}
                                            {item.quantity}

                                        </span>


                                        {item.variant && (

                                            <span>

                                                Variant:
                                                {" "}
                                                {typeof item.variant ===
                                                "object"
                                                    ? item.variant.variantType
                                                    : item.variant}

                                            </span>

                                        )}


                                        <span>

                                            <IndianRupee size={15} />

                                            ₹{item.totalPrice}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="admin-empty-state">

                        <Package size={42} />

                        <h3>

                            No items found

                        </h3>

                    </div>

                )}

            </section>


            {/* =========================
                PAYMENT SUMMARY
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            <IndianRupee size={20} />

                            Payment Summary

                        </h2>

                    </div>

                </div>


                <div className="admin-restaurant-details">

                    <span>

                        Subtotal:
                        {" "}
                        ₹{order.subTotal}

                    </span>


                    <span>

                        Delivery Charge:
                        {" "}
                        ₹{order.deliveryCharge}

                    </span>


                    <span>

                        Tax:
                        {" "}
                        ₹{order.tax}

                    </span>


                    <span>

                        <strong>

                            Grand Total:
                            {" "}
                            ₹{order.grandTotal}

                        </strong>

                    </span>


                    <span>

                        Payment Status:
                        {" "}

                        <strong>

                            {formatStatus(
                                order.paymentStatus
                            )}

                        </strong>

                    </span>

                </div>

            </section>


            {/* =========================
                NOTES
            ========================= */}

            {order.notes && (

                <section className="admin-content-card">

                    <div className="admin-content-toolbar">

                        <div>

                            <h2>

                                <FileText size={20} />

                                Customer Notes

                            </h2>

                        </div>

                    </div>


                    <p>

                        {order.notes}

                    </p>

                </section>

            )}


        </main>

    );

}