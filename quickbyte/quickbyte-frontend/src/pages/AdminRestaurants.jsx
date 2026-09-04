import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock3,
    Mail,
    Phone,
    Search,
    Store,
    XCircle,
} from "lucide-react";

import { getRestaurants } from "../api/restaurantApi";
import Loading from "../components/Loading";


export default function AdminRestaurants() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    useEffect(() => {
        loadRestaurants();
    }, []);


    const loadRestaurants = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getRestaurants();

            const data =
                response.data?.content ||
                response.data ||
                [];

            setRestaurants(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load restaurants:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load restaurants."
            );

        } finally {

            setLoading(false);

        }

    };


    const filteredRestaurants =
        useMemo(() => {

            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!query) {
                return restaurants;
            }

            return restaurants.filter(
                (restaurant) => {

                    const name =
                        String(
                            restaurant.name ||
                            restaurant.restaurantName ||
                            ""
                        ).toLowerCase();

                    return name.includes(query);

                }
            );

        }, [
            restaurants,
            searchQuery,
        ]);


    const getStatusIcon = (status) => {

        const normalizedStatus =
            String(status || "")
                .toUpperCase();

        if (
            normalizedStatus === "APPROVED" ||
            normalizedStatus === "ACTIVE"
        ) {
            return (
                <CheckCircle2 size={16} />
            );
        }

        if (
            normalizedStatus === "REJECTED" ||
            normalizedStatus === "INACTIVE"
        ) {
            return (
                <XCircle size={16} />
            );
        }

        return (
            <Clock3 size={16} />
        );

    };


    const getStatusClass = (status) => {

        const normalizedStatus =
            String(status || "")
                .toUpperCase();

        if (
            normalizedStatus === "APPROVED" ||
            normalizedStatus === "ACTIVE"
        ) {
            return "admin-status approved";
        }

        if (
            normalizedStatus === "REJECTED" ||
            normalizedStatus === "INACTIVE"
        ) {
            return "admin-status rejected";
        }

        return "admin-status pending";

    };


    if (loading) {
        return <Loading />;
    }


    return (

        <main className="admin-page">

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
                        RESTAURANT MANAGEMENT
                    </span>


                    <h1>
                        Restaurants
                    </h1>


                    <p>
                        View and manage restaurants
                        available on QuickByte.
                    </p>

                </div>


                <div className="admin-page-stat">

                    <Store size={22} />

                    <div>

                        <strong>
                            {restaurants.length}
                        </strong>

                        <span>
                            Total Restaurants
                        </span>

                    </div>

                </div>

            </section>


            {error && (

                <div className="admin-error">

                    <XCircle size={19} />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            <section className="admin-content-card">

                <div className="admin-content-toolbar">

                    <div>

                        <h2>
                            All Restaurants
                        </h2>

                        <p>
                            Search and view restaurant information.
                        </p>

                    </div>


                    <div className="admin-search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search restaurant..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {filteredRestaurants.length === 0 ? (

                    <div className="admin-empty-state">

                        <Building2 size={42} />

                        <h3>
                            No restaurants found
                        </h3>

                        <p>
                            {searchQuery
                                ? "Try searching with a different restaurant name."
                                : "Restaurants will appear here once they are created."
                            }
                        </p>

                    </div>

                ) : (

                    <div className="admin-restaurant-grid">

                        {filteredRestaurants.map(
                            (restaurant) => {

                                const status =
                                    restaurant.status ||
                                    "UNDER_VERIFICATION";

                                return (

                                    <Link
                                        key={restaurant.id}
                                        to={`/restaurants/${restaurant.id}`}
                                        className="admin-restaurant-card"
                                    >

                                        <div className="admin-restaurant-card-top">

                                            <div className="admin-restaurant-icon">

                                                <Store size={24} />

                                            </div>


                                            <span
                                                className={
                                                    getStatusClass(
                                                        status
                                                    )
                                                }
                                            >

                                                {getStatusIcon(
                                                    status
                                                )}

                                                {String(status)
                                                    .replaceAll(
                                                        "_",
                                                        " "
                                                    )}

                                            </span>

                                        </div>


                                        <div className="admin-restaurant-info">

                                            <h3>
                                                {restaurant.name ||
                                                    restaurant.restaurantName ||
                                                    "Restaurant"
                                                }
                                            </h3>


                                            <p>
                                                {restaurant.description ||
                                                    "No description available."
                                                }
                                            </p>

                                        </div>


                                        <div className="admin-restaurant-details">

                                            <span>

                                                <Mail size={15} />

                                                {restaurant.email ||
                                                    "No email"
                                                }

                                            </span>


                                            <span>

                                                <Phone size={15} />

                                                {restaurant.phoneNumber ||
                                                    "No phone number"
                                                }

                                            </span>

                                        </div>


                                        <div className="admin-restaurant-footer">

                                            <span>
                                                View restaurant details
                                            </span>

                                            <Building2 size={17} />

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