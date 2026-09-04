import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowLeft,
    Bike,
    ClipboardList,
    RefreshCw,
    UserRound,
    PackageCheck,
    IndianRupee,
    XCircle,
    CheckCircle2,
    Clock3,
} from "lucide-react";

import {
    getAllOrders,
} from "../api/orderApi";

import {
    getAvailablePartners,
    assignDeliveryPartner,
} from "../api/deliveryApi";

import Loading from "../components/Loading";


export default function AdminDeliveries() {

    const [orders, setOrders] =
        useState([]);

    const [partners, setPartners] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [assigningOrderId, setAssigningOrderId] =
        useState(null);


    /* =========================
       LOAD DATA
    ========================= */

    useEffect(() => {

        loadDeliveryData();

    }, []);


    const loadDeliveryData =
        async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    orderResponse,
                    partnerResponse,
                ] = await Promise.all([

                    getAllOrders(),

                    getAvailablePartners(),

                ]);


                const orderData =
                    orderResponse.data?.content ||
                    orderResponse.data ||
                    [];


                const availableOrders =
                    Array.isArray(orderData)
                        ? orderData.filter(
                            (order) =>
                                order.orderStatus ===
                                "READY_FOR_PICKUP"
                        )
                        : [];


                setOrders(
                    availableOrders
                );


                const partnerData =
                    partnerResponse.data?.content ||
                    partnerResponse.data ||
                    [];


                setPartners(
                    Array.isArray(partnerData)
                        ? partnerData
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load delivery data:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load delivery data."
                );

            } finally {

                setLoading(false);

            }

        };


    /* =========================
       ASSIGN PARTNER
    ========================= */

    const handleAssign =
        async (
            orderId,
            partnerId
        ) => {

            if (!partnerId) {

                setError(
                    "Please select a delivery partner."
                );

                return;

            }

            try {

                setAssigningOrderId(
                    orderId
                );

                setError("");

                await assignDeliveryPartner(
                    orderId,
                    Number(partnerId)
                );

                /*
                 * Reload orders and partners
                 * after successful assignment.
                 */
                await loadDeliveryData();

            } catch (error) {

                console.error(
                    "Failed to assign delivery partner:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to assign delivery partner."
                );

            } finally {

                setAssigningOrderId(
                    null
                );

            }

        };


    if (loading) {

        return <Loading />;

    }


    return (

        <main className="admin-page">


            {/* =========================
                HEADER
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

                        DELIVERY MANAGEMENT

                    </span>


                    <h1>

                        Deliveries

                    </h1>


                    <p>

                        Assign delivery partners to
                        orders that are ready for pickup.

                    </p>

                </div>


                <div className="admin-page-stat">

                    <PackageCheck size={22} />

                    <div>

                        <strong>

                            {orders.length}

                        </strong>

                        <span>

                            Ready for Pickup

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
                AVAILABLE PARTNERS
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            Available Delivery Partners

                        </h2>

                        <p>

                            {partners.length} partner
                            {partners.length !== 1
                                ? "s"
                                : ""
                            }
                            {" "}currently available.

                        </p>

                    </div>


                    <button
                        type="button"
                        className="primary"
                        onClick={
                            loadDeliveryData
                        }
                    >

                        <RefreshCw size={17} />

                        Refresh

                    </button>

                </div>


                {partners.length === 0 ? (

                    <div className="admin-empty-state">

                        <Bike size={42} />

                        <h3>

                            No delivery partners available

                        </h3>

                        <p>

                            Create or wait for a delivery
                            partner to become available.

                        </p>

                    </div>

                ) : (

                    <div className="admin-restaurant-grid">

                        {partners.map(
                            (partner) => (

                                <div
                                    key={
                                        partner.deliveryPartnerId
                                    }
                                    className="admin-restaurant-card"
                                >

                                    <div className="admin-restaurant-card-top">

                                        <div className="admin-restaurant-icon">

                                            <Bike size={24} />

                                        </div>


                                        <span className="admin-status approved">

                                            <CheckCircle2
                                                size={16}
                                            />

                                            AVAILABLE

                                        </span>

                                    </div>


                                    <div className="admin-restaurant-info">

                                        <h3>

                                            {
                                                partner.deliveryPartnerName
                                            }

                                        </h3>

                                        <p>

                                            <UserRound
                                                size={14}
                                            />

                                            {
                                                partner.phoneNumber
                                            }

                                        </p>

                                    </div>


                                    <div className="admin-restaurant-details">

                                        <span>

                                            Status:
                                            {" "}
                                            {
                                                partner.deliveryStatus
                                            }

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =========================
                READY FOR PICKUP ORDERS
            ========================= */}

            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>

                            Orders Ready for Pickup

                        </h2>

                        <p>

                            Select a delivery partner
                            and assign the order.

                        </p>

                    </div>

                </div>


                {orders.length === 0 ? (

                    <div className="admin-empty-state">

                        <ClipboardList size={42} />

                        <h3>

                            No orders ready for pickup

                        </h3>

                        <p>

                            Orders will appear here when
                            restaurant owners mark them
                            as ready for pickup.

                        </p>

                    </div>

                ) : (

                    <div className="admin-restaurant-grid">

                        {orders.map(
                            (order) => {

                                const total =
                                    order.grandTotal ??
                                    order.totalAmount ??
                                    "-";


                                return (

                                    <div
                                        key={order.id}
                                        className="admin-restaurant-card"
                                    >

                                        {/* TOP */}

                                        <div className="admin-restaurant-card-top">

                                            <div className="admin-restaurant-icon">

                                                <PackageCheck
                                                    size={24}
                                                />

                                            </div>


                                            <span className="admin-status pending">

                                                <Clock3
                                                    size={16}
                                                />

                                                READY FOR PICKUP

                                            </span>

                                        </div>


                                        {/* ORDER INFO */}

                                        <div className="admin-restaurant-info">

                                            <h3>

                                                Order #{order.id}

                                            </h3>

                                            <p>

                                                Customer:
                                                {" "}
                                                {
                                                    order.customerName ||
                                                    "Customer"
                                                }

                                            </p>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="admin-restaurant-details">

                                            <span>

                                                Restaurant:
                                                {" "}
                                                {
                                                    order.restaurantName ||
                                                    "Restaurant"
                                                }

                                            </span>


                                            <span>

                                                <IndianRupee
                                                    size={15}
                                                />

                                                {total}

                                            </span>

                                        </div>


                                        {/* ASSIGN */}

                                        <div className="admin-restaurant-footer">

                                            <select
                                                defaultValue=""
                                                id={`partner-${order.id}`}
                                                className="delivery-select"
                                            >

                                                <option value="">

                                                    Select Partner

                                                </option>


                                                {partners.map(
                                                    (partner) => (

                                                        <option
                                                            key={
                                                                partner.deliveryPartnerId
                                                            }
                                                            value={
                                                                partner.deliveryPartnerId
                                                            }
                                                        >

                                                            {
                                                                partner.deliveryPartnerName
                                                            }

                                                        </option>

                                                    )
                                                )}

                                            </select>


                                            <button
                                                type="button"
                                                className="primary"
                                                disabled={
                                                    assigningOrderId ===
                                                    order.id
                                                }
                                                onClick={() => {

                                                    const select =
                                                        document.getElementById(
                                                            `partner-${order.id}`
                                                        );

                                                    handleAssign(
                                                        order.id,
                                                        select?.value
                                                    );

                                                }}
                                            >

                                                <Bike size={16} />

                                                {assigningOrderId ===
                                                order.id
                                                    ? "Assigning..."
                                                    : "Assign"
                                                }

                                            </button>

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