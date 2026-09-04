import { useEffect, useState } from "react";

import {
    getMyRestaurants,
} from "../api/restaurantApi";

import {
    getRestaurantImages,
    createRestaurantImage,
    deleteRestaurantImage,
} from "../api/restaurantImageApi";


export default function OwnerImages() {

    const [
        restaurants,
        setRestaurants,
    ] = useState([]);

    const [
        selectedRestaurantId,
        setSelectedRestaurantId,
    ] = useState("");

    const [
        images,
        setImages,
    ] = useState([]);

    const [
        imageUrl,
        setImageUrl,
    ] = useState("");

    const [
        thumbnail,
        setThumbnail,
    ] = useState(false);

    const [
        displayOrder,
        setDisplayOrder,
    ] = useState(1);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");


    /*
     * LOAD OWNER RESTAURANTS
     */

    useEffect(() => {

        loadRestaurants();

    }, []);


    /*
     * LOAD RESTAURANT IMAGES
     */

    useEffect(() => {

        if (!selectedRestaurantId) {

            setImages([]);

            return;

        }

        loadImages(
            selectedRestaurantId
        );

    }, [selectedRestaurantId]);


    const loadRestaurants = async () => {

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


            /*
             * Automatically select
             * first restaurant
             */

            if (
                restaurantList.length > 0
            ) {

                setSelectedRestaurantId(
                    String(
                        restaurantList[0].id
                    )
                );

            }

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


    const loadImages =
        async (restaurantId) => {

            if (
                !restaurantId ||
                restaurantId === "undefined"
            ) {

                setImages([]);

                return;

            }

            try {

                setError("");

                const response =
                    await getRestaurantImages(
                        restaurantId
                    );

                const imageList =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.content || [];

                setImages(
                    imageList
                );


                /*
                 * Set next display order
                 */

                if (
                    imageList.length > 0
                ) {

                    const highestOrder =
                        Math.max(
                            ...imageList.map(
                                (image) =>
                                    Number(
                                        image.displayOrder
                                    ) || 0
                            )
                        );

                    setDisplayOrder(
                        highestOrder + 1
                    );

                } else {

                    setDisplayOrder(1);

                }

            } catch (err) {

                console.error(err);

                setImages([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load restaurant images."
                );

            }

        };


    const handleRestaurantChange =
        (e) => {

            const restaurantId =
                e.target.value;

            setSelectedRestaurantId(
                restaurantId
            );

            setImages([]);

            setImageUrl("");

            setThumbnail(false);

            setDisplayOrder(1);

            setMessage("");

            setError("");

        };


    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (
                !selectedRestaurantId ||
                selectedRestaurantId === "undefined"
            ) {

                setError(
                    "Please select a restaurant."
                );

                return;

            }

            if (!imageUrl.trim()) {

                setError(
                    "Please enter an image URL."
                );

                return;

            }

            try {

                setSaving(true);

                setMessage("");

                setError("");


                const payload = {

                    restaurantId:
                        Number(
                            selectedRestaurantId
                        ),

                    imageUrl:
                        imageUrl.trim(),

                    thumbnail,

                    displayOrder:
                        Number(
                            displayOrder
                        ),

                };


                await createRestaurantImage(
                    payload
                );


                /*
                 * Reload images from backend.
                 * This ensures the UI always uses
                 * the exact RestaurantImageResponse.
                 */

                await loadImages(
                    selectedRestaurantId
                );


                setImageUrl("");

                setThumbnail(false);


                setMessage(
                    "Restaurant image added successfully."
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to add restaurant image."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleDelete =
        async (imageId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this image?"
                );

            if (!confirmed) {

                return;

            }

            try {

                setSaving(true);

                setMessage("");

                setError("");


                await deleteRestaurantImage(
                    imageId
                );


                await loadImages(
                    selectedRestaurantId
                );


                setMessage(
                    "Restaurant image deleted successfully."
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to delete restaurant image."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (

            <main className="container">

                <p>
                    Loading restaurant image management...
                </p>

            </main>

        );

    }


    if (
        restaurants.length === 0
    ) {

        return (

            <main className="container">

                <h1>
                    Restaurant Image Management
                </h1>

                <p>
                    No restaurants found for this owner.
                </p>

            </main>

        );

    }


    return (

        <main className="container">

            <h1>
                Restaurant Image Management
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


            {/* RESTAURANT SELECTOR */}

            <section className="card">

                <h2>
                    Select Restaurant
                </h2>


                <select
                    value={
                        selectedRestaurantId
                    }
                    onChange={
                        handleRestaurantChange
                    }
                >

                    <option value="">
                        Select Restaurant
                    </option>


                    {restaurants.map(
                        (restaurant) => (

                            <option
                                key={
                                    restaurant.id
                                }
                                value={
                                    restaurant.id
                                }
                            >

                                {
                                    restaurant.name
                                }

                            </option>

                        )
                    )}

                </select>

            </section>


            {/* IMAGE FORM */}

            {selectedRestaurantId && (

                <section className="card">

                    <h2>
                        Add Restaurant Image
                    </h2>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <input
                            type="url"
                            placeholder="Image URL"
                            value={
                                imageUrl
                            }
                            onChange={
                                (e) =>
                                    setImageUrl(
                                        e.target.value
                                    )
                            }
                            required
                        />


                        <input
                            type="number"
                            min="1"
                            placeholder="Display Order"
                            value={
                                displayOrder
                            }
                            onChange={
                                (e) =>
                                    setDisplayOrder(
                                        e.target.value
                                    )
                            }
                            required
                        />


                        <label>

                            <input
                                type="checkbox"
                                checked={
                                    thumbnail
                                }
                                onChange={
                                    (e) =>
                                        setThumbnail(
                                            e.target.checked
                                        )
                                }
                            />

                            Thumbnail

                        </label>


                        <button
                            type="submit"
                            className="primary"
                            disabled={
                                saving
                            }
                        >

                            {saving
                                ? "Saving..."
                                : "Add Image"}

                        </button>

                    </form>

                </section>

            )}


            {/* IMAGE LIST */}

            {selectedRestaurantId && (

                <section>

                    <h2>
                        Restaurant Images
                    </h2>


                    {images.length === 0 ? (

                        <p>
                            No images found for this restaurant.
                        </p>

                    ) : (

                        <div className="grid">

                            {images.map(
                                (image) => (

                                    <div
                                        className="card"
                                        key={
                                            image.id
                                        }
                                    >

                                        <img
                                            src={
                                                image.imageUrl
                                            }
                                            alt={
                                                image.restaurantName ||
                                                "Restaurant"
                                            }
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                            onError={
                                                (e) => {

                                                    e.currentTarget.style.display =
                                                        "none";

                                                }
                                            }
                                        />


                                        <p>

                                            <strong>
                                                Display Order:
                                            </strong>

                                            {" "}

                                            {
                                                image.displayOrder
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Type:
                                            </strong>

                                            {" "}

                                            {image.thumbnail
                                                ? "Thumbnail"
                                                : "Regular Image"}

                                        </p>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    image.id
                                                )
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            Delete

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            )}

        </main>

    );

}