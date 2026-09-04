import { useEffect, useState } from "react";

import {
    getMyRestaurants,
    createRestaurant,
    updateRestaurant,
} from "../api/restaurantApi";


const initialForm = {
    name: "",
    description: "",
    email: "",
    phoneNumber: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
};


export default function RestaurantManagement() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [selectedRestaurant, setSelectedRestaurant] =
        useState(null);

    const [form, setForm] =
        useState(initialForm);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editing, setEditing] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadMyRestaurants();

    }, []);


    const loadMyRestaurants = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyRestaurants();


            const restaurantList =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || [];


            setRestaurants(
                restaurantList
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load restaurants."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));

    };


    const handleEdit =
        (restaurant) => {

            setSelectedRestaurant(
                restaurant
            );

            setForm({

                name:
                    restaurant.name || "",

                description:
                    restaurant.description || "",

                email:
                    restaurant.email || "",

                phoneNumber:
                    restaurant.phoneNumber || "",

                street:
                    restaurant.street || "",

                area:
                    restaurant.area || "",

                landmark:
                    restaurant.landmark || "",

                city:
                    restaurant.city || "",

                district:
                    restaurant.district || "",

                state:
                    restaurant.state || "",

                country:
                    restaurant.country || "",

                pincode:
                    restaurant.pincode || "",

                latitude:
                    restaurant.latitude ?? "",

                longitude:
                    restaurant.longitude ?? "",

            });

            setEditing(true);

            setCreating(false);

            setMessage("");

            setError("");

        };


    const handleCreate = () => {

        setSelectedRestaurant(
            null
        );

        setForm(
            initialForm
        );

        setCreating(true);

        setEditing(false);

        setMessage("");

        setError("");

    };


    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                setSaving(true);

                setError("");

                setMessage("");


                const payload = {

                    name:
                    form.name,

                    description:
                    form.description,

                    email:
                    form.email,

                    phoneNumber:
                    form.phoneNumber,

                    street:
                    form.street,

                    area:
                    form.area,

                    landmark:
                    form.landmark,

                    city:
                    form.city,

                    district:
                    form.district,

                    state:
                    form.state,

                    country:
                    form.country,

                    pincode:
                    form.pincode,

                    latitude:
                        Number(
                            form.latitude
                        ),

                    longitude:
                        Number(
                            form.longitude
                        ),

                };


                if (
                    selectedRestaurant
                ) {

                    await updateRestaurant(

                        selectedRestaurant.id,

                        payload

                    );


                    setMessage(
                        "Restaurant updated successfully."
                    );

                } else {

                    await createRestaurant(
                        payload
                    );


                    setMessage(
                        "Restaurant created successfully."
                    );

                }


                await loadMyRestaurants();


                setSelectedRestaurant(
                    null
                );

                setEditing(false);

                setCreating(false);

                setForm(
                    initialForm
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Something went wrong. Please try again."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleCancel = () => {

        setSelectedRestaurant(
            null
        );

        setForm(
            initialForm
        );

        setEditing(false);

        setCreating(false);

        setError("");

    };


    if (loading) {

        return (

            <main className="container">

                <p>
                    Loading restaurants...
                </p>

            </main>

        );

    }


    /*
     * RESTAURANT LIST
     */

    if (
        !editing &&
        !creating
    ) {

        return (

            <main className="container">

                <h1>
                    My Restaurants
                </h1>


                {message && (

                    <p>
                        {message}
                    </p>

                )}


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                <button
                    className="primary"
                    onClick={
                        handleCreate
                    }
                >

                    Create New Restaurant

                </button>


                <br />

                <br />


                {restaurants.length === 0 ? (

                    <p>
                        You have not created any restaurants yet.
                    </p>

                ) : (

                    <div className="grid">

                        {restaurants.map(
                            (restaurant) => (

                                <div
                                    className="card"
                                    key={
                                        restaurant.id
                                    }
                                >

                                    <h2>
                                        {restaurant.name}
                                    </h2>


                                    {restaurant.description && (

                                        <p>
                                            {
                                                restaurant.description
                                            }
                                        </p>

                                    )}


                                    <p>

                                        <strong>
                                            Email:
                                        </strong>

                                        {" "}

                                        {
                                            restaurant.email ||
                                            "-"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Phone:
                                        </strong>

                                        {" "}

                                        {
                                            restaurant.phoneNumber ||
                                            "-"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Address:
                                        </strong>

                                        {" "}

                                        {[
                                            restaurant.street,
                                            restaurant.area,
                                            restaurant.city,
                                            restaurant.district,
                                            restaurant.state,
                                            restaurant.country,
                                            restaurant.pincode,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "-"}

                                    </p>


                                    {restaurant.landmark && (

                                        <p>

                                            <strong>
                                                Landmark:
                                            </strong>

                                            {" "}

                                            {
                                                restaurant.landmark
                                            }

                                        </p>

                                    )}


                                    <p>

                                        <strong>
                                            Status:
                                        </strong>

                                        {" "}

                                        {
                                            restaurant.status ||
                                            "-"
                                        }

                                    </p>


                                    <button
                                        className="primary"
                                        onClick={() =>
                                            handleEdit(
                                                restaurant
                                            )
                                        }
                                    >

                                        Edit Restaurant

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        );

    }


    /*
     * CREATE / EDIT FORM
     */

    return (

        <main className="container">

            <h1>

                {selectedRestaurant
                    ? "Edit Restaurant"
                    : "Create Restaurant"}

            </h1>


            {error && (

                <p>
                    {error}
                </p>

            )}


            <form
                className="card"
                onSubmit={handleSubmit}
            >

                <input
                    name="name"
                    placeholder="Restaurant Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />


                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />


                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />


                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                />


                <input
                    name="street"
                    placeholder="Street"
                    value={form.street}
                    onChange={handleChange}
                    required
                />


                <input
                    name="area"
                    placeholder="Area"
                    value={form.area}
                    onChange={handleChange}
                    required
                />


                <input
                    name="landmark"
                    placeholder="Landmark (Optional)"
                    value={form.landmark}
                    onChange={handleChange}
                />


                <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                />


                <input
                    name="district"
                    placeholder="District"
                    value={form.district}
                    onChange={handleChange}
                    required
                />


                <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                />


                <input
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                    required
                />


                <input
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                />


                <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                />


                <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                />


                <button
                    className="primary"
                    type="submit"
                    disabled={saving}
                >

                    {saving
                        ? "Saving..."
                        : selectedRestaurant
                            ? "Update Restaurant"
                            : "Create Restaurant"}

                </button>


                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                >

                    Cancel

                </button>

            </form>

        </main>

    );

}