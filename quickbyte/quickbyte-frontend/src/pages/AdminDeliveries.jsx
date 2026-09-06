import {
    useEffect,
    useState
} from "react";

import {
    Bike,
    Package,
    UserCheck,
    Truck,
    CheckCircle,
    RefreshCw
} from "lucide-react";

import {
    getAvailablePartners,
    getActiveDeliveries,
    assignDelivery,
    updateDeliveryStatus
} from "../api/deliveryApi";

import api from "../api/axios";


export default function AdminDeliveries() {


    /*
    ================================
    STATES
    ================================
    */

    const [
        availablePartners,
        setAvailablePartners
    ] = useState([]);


    const [
        activeDeliveries,
        setActiveDeliveries
    ] = useState([]);


    const [
        readyOrders,
        setReadyOrders
    ] = useState([]);


    const [
        selectedPartners,
        setSelectedPartners
    ] = useState({});


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    /*
    ================================
    LOAD ALL DELIVERY DATA
    ================================
    */

    const loadDeliveryData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                availableResponse,
                activeResponse,
                ordersResponse
            ] = await Promise.all([

                getAvailablePartners(),

                getActiveDeliveries(),

                api.get(
                    "/orders/status/READY_FOR_PICKUP"
                )

            ]);


            setAvailablePartners(
                availableResponse.data
            );


            setActiveDeliveries(
                activeResponse.data
            );


            setReadyOrders(
                ordersResponse.data
            );


        } catch (error) {

            console.error(
                "Failed to load delivery data:",
                error
            );


            setError(
                "Failed to load delivery information."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    ================================
    INITIAL LOAD
    ================================
    */

    useEffect(() => {

        loadDeliveryData();

    }, []);



    /*
    ================================
    SELECT DELIVERY PARTNER
    ================================
    */

    const handlePartnerChange = (
        orderId,
        partnerId
    ) => {

        setSelectedPartners(
            previous => ({

                ...previous,

                [orderId]: partnerId

            })
        );

    };



    /*
    ================================
    ASSIGN DELIVERY
    ================================
    */

    const handleAssignDelivery = async (
        orderId
    ) => {

        const partnerId =
            selectedPartners[orderId];


        if (!partnerId) {

            alert(
                "Please select a delivery partner."
            );

            return;

        }


        try {

            await assignDelivery({

                orderId: Number(orderId),

                deliveryPartnerId:
                    Number(partnerId)

            });


            alert(
                "Order assigned successfully."
            );


            await loadDeliveryData();


        } catch (error) {

            console.error(
                "Failed to assign delivery:",
                error
            );


            alert(

                error?.response?.data?.message ||

                "Failed to assign delivery."

            );

        }

    };



    /*
    ================================
    UPDATE DELIVERY STATUS
    ================================
    */

    const handleStatusUpdate = async (

        partnerId,

        status

    ) => {

        try {

            await updateDeliveryStatus(

                partnerId,

                status

            );


            await loadDeliveryData();


        } catch (error) {

            console.error(
                "Failed to update delivery status:",
                error
            );


            alert(

                error?.response?.data?.message ||

                "Failed to update delivery status."

            );

        }

    };



    /*
    ================================
    LOADING
    ================================
    */

    if (loading) {

        return (

            <main className="admin-deliveries-page">

                <div className="admin-deliveries-container">

                    <p>
                        Loading deliveries...
                    </p>

                </div>

            </main>

        );

    }



    /*
    ================================
    UI
    ================================
    */

    return (

        <main className="admin-deliveries-page">

            <div className="admin-deliveries-container">


                {/* =========================
                    HEADER
                ========================= */}

                <section className="admin-deliveries-hero">

                    <div>

                        <span className="admin-deliveries-badge">

                            <Bike size={15} />

                            DELIVERY MANAGEMENT

                        </span>


                        <h1>

                            Manage
                            <span> Deliveries</span>

                        </h1>


                        <p>

                            Assign orders, monitor delivery
                            partners and track active deliveries.

                        </p>

                    </div>


                    <div className="admin-deliveries-hero-icon">

                        <Truck size={40} />

                    </div>

                </section>



                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="delivery-error">

                        {error}

                    </div>

                )}



                {/* =========================
                    REFRESH BUTTON
                ========================= */}

                <div className="delivery-refresh-container">

                    <button

                        className="delivery-refresh-button"

                        onClick={
                            loadDeliveryData
                        }

                    >

                        <RefreshCw size={16} />

                        Refresh

                    </button>

                </div>



                {/* =========================
                    AVAILABLE PARTNERS
                ========================= */}

                <section className="delivery-section">

                    <div className="delivery-section-header">

                        <div>

                            <span>
                                DELIVERY PARTNERS
                            </span>

                            <h2>

                                Available Delivery Partners

                            </h2>

                        </div>


                        <strong>

                            {
                                availablePartners.length
                            }

                            {" "}Available

                        </strong>

                    </div>



                    <div className="delivery-grid">


                        {availablePartners.length === 0 ? (

                            <div className="empty-delivery-card">

                                <UserCheck size={30} />

                                <p>

                                    No available delivery partners.

                                </p>

                            </div>

                        ) : (

                            availablePartners.map(
                                partner => (

                                    <div

                                        key={
                                            partner.deliveryPartnerId
                                        }

                                        className="delivery-card"

                                    >

                                        <div className="delivery-card-top">

                                            <div className="delivery-icon">

                                                <Bike size={22} />

                                            </div>


                                            <span className="available-badge">

                                                AVAILABLE

                                            </span>

                                        </div>


                                        <h3>

                                            {
                                                partner.deliveryPartnerName
                                            }

                                        </h3>


                                        <p>

                                            {
                                                partner.phoneNumber
                                            }

                                        </p>


                                        <div className="delivery-status">

                                            Status:

                                            <strong>

                                                {
                                                    partner.deliveryStatus
                                                }

                                            </strong>

                                        </div>

                                    </div>

                                )

                            )

                        )}


                    </div>

                </section>



                {/* =========================
                    READY FOR PICKUP ORDERS
                ========================= */}

                <section className="delivery-section">

                    <div className="delivery-section-header">

                        <div>

                            <span>
                                ORDERS
                            </span>

                            <h2>

                                Ready For Pickup Orders

                            </h2>

                        </div>


                        <strong>

                            {
                                readyOrders.length
                            }

                            {" "}Orders

                        </strong>

                    </div>



                    <div className="delivery-grid">


                        {readyOrders.length === 0 ? (

                            <div className="empty-delivery-card">

                                <Package size={30} />

                                <p>

                                    No orders are ready for pickup.

                                </p>

                            </div>

                        ) : (

                            readyOrders.map(
                                order => (

                                    <div

                                        key={order.id}

                                        className="delivery-card"

                                    >

                                        <div className="delivery-card-top">

                                            <div className="delivery-icon">

                                                <Package
                                                    size={22}
                                                />

                                            </div>


                                            <span className="pickup-badge">

                                                READY FOR PICKUP

                                            </span>

                                        </div>


                                        <h3>

                                            Order #

                                            {order.id}

                                        </h3>


                                        <p>

                                            Customer:

                                            {" "}

                                            {
                                                order.customerName ||
                                                "Customer"
                                            }

                                        </p>



                                        {/* SELECT PARTNER */}

                                        <select

                                            value={

                                                selectedPartners[
                                                    order.id
                                                ] || ""

                                            }

                                            onChange={event =>

                                                handlePartnerChange(

                                                    order.id,

                                                    event.target.value

                                                )

                                            }

                                        >

                                            <option value="">

                                                Select Delivery Partner

                                            </option>


                                            {

                                                availablePartners.map(

                                                    partner => (

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

                                                )

                                            }

                                        </select>



                                        <button

                                            className="assign-delivery-button"

                                            onClick={() =>

                                                handleAssignDelivery(
                                                    order.id
                                                )

                                            }

                                        >

                                            Assign Delivery

                                        </button>

                                    </div>

                                )

                            )

                        )}


                    </div>

                </section>



                {/* =========================
                    ACTIVE DELIVERIES
                ========================= */}

                <section className="delivery-section">

                    <div className="delivery-section-header">

                        <div>

                            <span>
                                DELIVERY TRACKING
                            </span>

                            <h2>

                                Active Deliveries

                            </h2>

                        </div>


                        <strong>

                            {
                                activeDeliveries.length
                            }

                            {" "}Active

                        </strong>

                    </div>



                    <div className="delivery-grid">


                        {activeDeliveries.length === 0 ? (

                            <div className="empty-delivery-card">

                                <Truck size={30} />

                                <p>

                                    No active deliveries found.

                                </p>

                            </div>

                        ) : (

                            activeDeliveries.map(
                                delivery => (

                                    <div

                                        key={
                                            delivery.deliveryPartnerId
                                        }

                                        className="delivery-card active-delivery-card"

                                    >

                                        <div className="delivery-card-top">

                                            <div className="delivery-icon">

                                                <Truck size={22} />

                                            </div>


                                            <span className="active-badge">

                                                ACTIVE

                                            </span>

                                        </div>



                                        <h3>

                                            {
                                                delivery.deliveryPartnerName
                                            }

                                        </h3>


                                        <p>

                                            Order #

                                            {
                                                delivery.orderId
                                            }

                                        </p>


                                        <p>

                                            {
                                                delivery.phoneNumber
                                            }

                                        </p>



                                        {/* CURRENT STATUS */}

                                        <div className="delivery-current-status">

                                            Current Status

                                            <strong>

                                                {
                                                    delivery.deliveryStatus
                                                }

                                            </strong>

                                        </div>



                                        {/* ASSIGNED */}

                                        {

                                            delivery.deliveryStatus ===
                                            "ASSIGNED"

                                            && (

                                                <button

                                                    className="status-button"

                                                    onClick={() =>

                                                        handleStatusUpdate(

                                                            delivery.deliveryPartnerId,

                                                            "PICKED_UP"

                                                        )

                                                    }

                                                >

                                                    Mark as Picked Up

                                                </button>

                                            )

                                        }



                                        {/* PICKED UP */}

                                        {

                                            delivery.deliveryStatus ===
                                            "PICKED_UP"

                                            && (

                                                <button

                                                    className="status-button"

                                                    onClick={() =>

                                                        handleStatusUpdate(

                                                            delivery.deliveryPartnerId,

                                                            "ON_THE_WAY"

                                                        )

                                                    }

                                                >

                                                    Start Delivery

                                                </button>

                                            )

                                        }



                                        {/* ON THE WAY */}

                                        {

                                            delivery.deliveryStatus ===
                                            "ON_THE_WAY"

                                            && (

                                                <button

                                                    className="status-button"

                                                    onClick={() =>

                                                        handleStatusUpdate(

                                                            delivery.deliveryPartnerId,

                                                            "DELIVERED"

                                                        )

                                                    }

                                                >

                                                    <CheckCircle
                                                        size={17}
                                                    />

                                                    Mark as Delivered

                                                </button>

                                            )

                                        }

                                    </div>

                                )

                            )

                        )}


                    </div>

                </section>


            </div>

        </main>

    );

}