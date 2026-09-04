import {
    useEffect,
    useState,
} from "react";

import {
    getMyRestaurants,
} from "../api/restaurantApi";

import {
    getRestaurantTimings,
    createRestaurantTiming,
    updateRestaurantTiming,
    deleteRestaurantTiming,
} from "../api/restaurantTimingApi";


const DAYS = [

    "MONDAY",

    "TUESDAY",

    "WEDNESDAY",

    "THURSDAY",

    "FRIDAY",

    "SATURDAY",

    "SUNDAY",

];


export default function OwnerTimings() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [
        selectedRestaurantId,
        setSelectedRestaurantId,
    ] = useState("");

    const [timings, setTimings] =
        useState([]);


    const [dayOfWeek, setDayOfWeek] =
        useState("MONDAY");

    const [openingTime, setOpeningTime] =
        useState("09:00");

    const [closingTime, setClosingTime] =
        useState("22:00");

    const [closed, setClosed] =
        useState(false);


    const [
        editingTimingId,
        setEditingTimingId,
    ] = useState(null);


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    /*
     * LOAD OWNER RESTAURANTS
     */

    useEffect(() => {

        loadRestaurants();

    }, []);


    /*
     * LOAD TIMINGS
     */

    useEffect(() => {

        if (!selectedRestaurantId) {

            setTimings([]);

            return;

        }

        loadTimings(
            selectedRestaurantId
        );

    }, [selectedRestaurantId]);


    const loadRestaurants =
        async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getMyRestaurants();


                const restaurantList =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data?.content || [];


                setRestaurants(
                    restaurantList
                );


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


    const loadTimings =
        async (restaurantId) => {

            try {

                setError("");

                const response =
                    await getRestaurantTimings(
                        restaurantId
                    );


                const timingList =
                    response.data?.content ||
                    response.data ||
                    [];


                setTimings(
                    timingList
                );

            } catch (err) {

                console.error(err);

                setTimings([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load restaurant timings."
                );

            }

        };


    const resetForm = () => {

        setDayOfWeek(
            "MONDAY"
        );

        setOpeningTime(
            "09:00"
        );

        setClosingTime(
            "22:00"
        );

        setClosed(false);

        setEditingTimingId(
            null
        );

    };


    const handleRestaurantChange =
        (e) => {

            const restaurantId =
                e.target.value;

            setSelectedRestaurantId(
                restaurantId
            );

            setTimings([]);

            resetForm();

            setMessage("");

            setError("");

        };


    const handleSubmit =
        async (e) => {

            e.preventDefault();


            if (
                !selectedRestaurantId
            ) {

                setError(
                    "Please select a restaurant."
                );

                return;

            }


            /*
             * Prevent duplicate day
             * when creating a new timing
             */

            if (

                !editingTimingId &&

                timings.some(
                    (timing) =>
                        timing.dayOfWeek ===
                        dayOfWeek
                )

            ) {

                setError(
                    `${dayOfWeek} already has a timing. Please edit the existing timing.`
                );

                return;

            }


            const payload = {

                restaurantId:
                    Number(
                        selectedRestaurantId
                    ),

                dayOfWeek,

                openingTime:
                    closed
                        ? null
                        : openingTime,

                closingTime:
                    closed
                        ? null
                        : closingTime,

                closed,

            };


            try {

                setSaving(true);

                setError("");

                setMessage("");


                if (
                    editingTimingId
                ) {

                    await updateRestaurantTiming(

                        editingTimingId,

                        payload

                    );


                    setMessage(
                        "Restaurant timing updated successfully."
                    );

                } else {

                    await createRestaurantTiming(
                        payload
                    );


                    setMessage(
                        "Restaurant timing created successfully."
                    );

                }


                resetForm();


                await loadTimings(
                    selectedRestaurantId
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to save restaurant timing."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleEdit =
        (timing) => {

            setDayOfWeek(
                timing.dayOfWeek
            );


            setOpeningTime(

                timing.openingTime
                    ? timing.openingTime.substring(
                        0,
                        5
                    )
                    : "09:00"

            );


            setClosingTime(

                timing.closingTime
                    ? timing.closingTime.substring(
                        0,
                        5
                    )
                    : "22:00"

            );


            setClosed(
                timing.closed ?? false
            );


            setEditingTimingId(
                timing.id
            );


            setMessage(
                `Editing ${timing.dayOfWeek}`
            );

            setError("");

        };


    const handleDelete =
        async (timingId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this timing?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setSaving(true);

                setError("");

                await deleteRestaurantTiming(
                    timingId
                );


                setMessage(
                    "Restaurant timing deleted successfully."
                );


                if (
                    editingTimingId ===
                    timingId
                ) {

                    resetForm();

                }


                await loadTimings(
                    selectedRestaurantId
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to delete restaurant timing."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (

            <main className="container">

                <p>
                    Loading restaurant timing management...
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
                    Restaurant Timing Management
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
                Restaurant Timing Management
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


            {/* CREATE / UPDATE FORM */}

            {selectedRestaurantId && (

                <section className="card">

                    <h2>

                        {editingTimingId
                            ? "Edit Restaurant Timing"
                            : "Add Restaurant Timing"}

                    </h2>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <select
                            value={
                                dayOfWeek
                            }
                            onChange={
                                (e) =>
                                    setDayOfWeek(
                                        e.target.value
                                    )
                            }
                        >

                            {DAYS.map(
                                (day) => (

                                    <option
                                        key={day}
                                        value={day}
                                    >

                                        {day}

                                    </option>

                                )
                            )}

                        </select>


                        {!closed && (

                            <>

                                <label>
                                    Opening Time
                                </label>

                                <input
                                    type="time"
                                    value={
                                        openingTime
                                    }
                                    onChange={
                                        (e) =>
                                            setOpeningTime(
                                                e.target.value
                                            )
                                    }
                                    required
                                />


                                <label>
                                    Closing Time
                                </label>

                                <input
                                    type="time"
                                    value={
                                        closingTime
                                    }
                                    onChange={
                                        (e) =>
                                            setClosingTime(
                                                e.target.value
                                            )
                                    }
                                    required
                                />

                            </>

                        )}


                        <label>

                            <input
                                type="checkbox"
                                checked={
                                    closed
                                }
                                onChange={
                                    (e) =>
                                        setClosed(
                                            e.target.checked
                                        )
                                }
                            />

                            Closed

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
                                : editingTimingId
                                    ? "Update Timing"
                                    : "Add Timing"}

                        </button>


                        {editingTimingId && (

                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                            >

                                Cancel

                            </button>

                        )}

                    </form>

                </section>

            )}


            {/* TIMING LIST */}

            {selectedRestaurantId && (

                <section>

                    <h2>
                        Restaurant Timings
                    </h2>


                    {timings.length === 0 ? (

                        <p>
                            No timings added yet.
                        </p>

                    ) : (

                        <div className="grid">

                            {timings.map(
                                (timing) => (

                                    <div
                                        className="card"
                                        key={
                                            timing.id
                                        }
                                    >

                                        <h3>

                                            {
                                                timing.dayOfWeek
                                            }

                                        </h3>


                                        {timing.closed ? (

                                            <p>
                                                Closed
                                            </p>

                                        ) : (

                                            <p>

                                                {
                                                    timing.openingTime
                                                        ?.substring(
                                                            0,
                                                            5
                                                        )
                                                }

                                                {" - "}

                                                {
                                                    timing.closingTime
                                                        ?.substring(
                                                            0,
                                                            5
                                                        )
                                                }

                                            </p>

                                        )}


                                        <button
                                            className="primary"
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    timing
                                                )
                                            }
                                        >

                                            Edit

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    timing.id
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