import { useEffect, useState } from "react";
import {
    getMyRestaurant,
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
    const [restaurant, setRestaurant] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadMyRestaurant();
    }, []);

    const loadMyRestaurant = async () => {
        try {
            setLoading(true);

            const response = await getMyRestaurant();

            setRestaurant(response.data);

            setForm({
                name: response.data.name || "",
                description: response.data.description || "",
                email: response.data.email || "",
                phoneNumber: response.data.phoneNumber || "",
                street: response.data.street || "",
                area: response.data.area || "",
                landmark: response.data.landmark || "",
                city: response.data.city || "",
                district: response.data.district || "",
                state: response.data.state || "",
                country: response.data.country || "",
                pincode: response.data.pincode || "",
                latitude: response.data.latitude || "",
                longitude: response.data.longitude || "",
            });
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load restaurant."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const payload = {
                ...form,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
            };

            let response;

            if (restaurant) {
                response = await updateRestaurant(
                    restaurant.id,
                    payload
                );

                setMessage("Restaurant updated successfully.");
            } else {
                response = await createRestaurant(payload);

                setMessage("Restaurant created successfully.");
            }

            setRestaurant(response.data);
            setEditing(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="container">
                <p>Loading restaurant...</p>
            </main>
        );
    }

    if (restaurant && !editing) {
        return (
            <main className="container">
                <h1>My Restaurant</h1>

                {message && <p>{message}</p>}

                <div className="card">
                    <h2>{restaurant.name}</h2>

                    <p>{restaurant.description}</p>

                    <p>
                        <strong>Email:</strong> {restaurant.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {restaurant.phoneNumber}
                    </p>

                    <p>
                        <strong>Address:</strong>{" "}
                        {restaurant.street}, {restaurant.area},
                        {" "}
                        {restaurant.city}, {restaurant.district},
                        {" "}
                        {restaurant.state}, {restaurant.country}
                        {" - "}
                        {restaurant.pincode}
                    </p>

                    {restaurant.landmark && (
                        <p>
                            <strong>Landmark:</strong>{" "}
                            {restaurant.landmark}
                        </p>
                    )}

                    <button
                        className="primary"
                        onClick={() => {
                            setEditing(true);
                            setMessage("");
                        }}
                    >
                        Edit Restaurant
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container">
            <h1>
                {restaurant
                    ? "Edit Restaurant"
                    : "Create Restaurant"}
            </h1>

            {error && <p>{error}</p>}

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
                        : restaurant
                            ? "Update Restaurant"
                            : "Create Restaurant"}
                </button>

                {restaurant && (
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </main>
    );
}