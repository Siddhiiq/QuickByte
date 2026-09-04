import {
    useEffect,
    useState,
} from "react";

import {
    getMyRestaurants,
} from "../api/restaurantApi";

import {
    getCategoriesByRestaurant,
} from "../api/categoryApi";

import {
    getFoodsByCategory,
} from "../api/foodApi";

import {
    getFoodAddonsByFood,
    createFoodAddon,
    updateFoodAddon,
    deleteFoodAddon,
} from "../api/foodAddonApi";


const initialForm = {
    name: "",
    price: "",
    available: true,
    displayOrder: "",
};


export default function AddonManagement() {

    const [
        restaurants,
        setRestaurants,
    ] = useState([]);

    const [
        selectedRestaurant,
        setSelectedRestaurant,
    ] = useState("");

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("");

    const [
        foods,
        setFoods,
    ] = useState([]);

    const [
        selectedFood,
        setSelectedFood,
    ] = useState("");

    const [
        addons,
        setAddons,
    ] = useState([]);

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

    const [
        form,
        setForm,
    ] = useState(initialForm);

    const [
        editingAddon,
        setEditingAddon,
    ] = useState(null);


    useEffect(() => {
        loadRestaurants();
    }, []);


    const loadRestaurants =
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getMyRestaurants();

                const restaurantList =
                    response.data || [];

                setRestaurants(
                    restaurantList
                );

                if (
                    restaurantList.length > 0
                ) {

                    const restaurantId =
                        restaurantList[0].id;

                    setSelectedRestaurant(
                        String(restaurantId)
                    );

                    await loadCategories(
                        restaurantId
                    );

                }

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load restaurants."
                );

            } finally {

                setLoading(false);

            }

        };


    const loadCategories =
        async (restaurantId) => {

            try {

                const response =
                    await getCategoriesByRestaurant(
                        restaurantId
                    );

                const categoryList =
                    response.data?.content ||
                    response.data ||
                    [];

                setCategories(
                    categoryList
                );


                if (
                    categoryList.length > 0
                ) {

                    const categoryId =
                        categoryList[0].id;

                    setSelectedCategory(
                        String(categoryId)
                    );

                    await loadFoods(
                        categoryId
                    );

                } else {

                    setSelectedCategory("");
                    setFoods([]);
                    setAddons([]);

                }

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load categories."
                );

            }

        };


    const loadFoods =
        async (categoryId) => {

            try {

                const response =
                    await getFoodsByCategory(
                        categoryId
                    );

                const foodList =
                    response.data?.content ||
                    response.data ||
                    [];

                setFoods(
                    foodList
                );


                if (
                    foodList.length > 0
                ) {

                    const foodId =
                        foodList[0].id;

                    setSelectedFood(
                        String(foodId)
                    );

                    await loadAddons(
                        foodId
                    );

                } else {

                    setSelectedFood("");
                    setAddons([]);

                }

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load foods."
                );

            }

        };


    const loadAddons =
        async (foodId) => {

            try {

                const response =
                    await getFoodAddonsByFood(
                        foodId
                    );

                const addonList =
                    response.data?.content ||
                    response.data ||
                    [];

                setAddons(
                    addonList
                );

            } catch (err) {

                setAddons([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load add-ons."
                );

            }

        };


    const handleRestaurantChange =
        async (e) => {

            const restaurantId =
                e.target.value;

            setSelectedRestaurant(
                restaurantId
            );

            setCategories([]);
            setFoods([]);
            setAddons([]);

            setSelectedCategory("");
            setSelectedFood("");

            setEditingAddon(null);
            setForm(initialForm);

            setMessage("");
            setError("");

            if (restaurantId) {

                await loadCategories(
                    restaurantId
                );

            }

        };


    const handleCategoryChange =
        async (e) => {

            const categoryId =
                e.target.value;

            setSelectedCategory(
                categoryId
            );

            setFoods([]);
            setAddons([]);

            setSelectedFood("");

            setEditingAddon(null);
            setForm(initialForm);

            setMessage("");
            setError("");

            if (categoryId) {

                await loadFoods(
                    categoryId
                );

            }

        };


    const handleFoodChange =
        async (e) => {

            const foodId =
                e.target.value;

            setSelectedFood(
                foodId
            );

            setEditingAddon(null);
            setForm(initialForm);

            setMessage("");
            setError("");

            if (foodId) {

                await loadAddons(
                    foodId
                );

            } else {

                setAddons([]);

            }

        };


    const handleChange =
        (e) => {

            const {
                name,
                value,
                type,
                checked,
            } = e.target;

            setForm(
                (previous) => ({
                    ...previous,

                    [name]:
                        type === "checkbox"
                            ? checked
                            : value,
                })
            );

        };


    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!selectedFood) {

                setError(
                    "Please select a food."
                );

                return;

            }

            try {

                setSaving(true);

                setError("");
                setMessage("");

                const payload = {

                    foodId:
                        Number(selectedFood),

                    name:
                    form.name,

                    price:
                        Number(form.price),

                    available:
                    form.available,

                    displayOrder:
                        Number(
                            form.displayOrder
                        ),

                };


                if (editingAddon) {

                    await updateFoodAddon(
                        editingAddon.id,
                        payload
                    );

                    setMessage(
                        "Add-on updated successfully."
                    );

                } else {

                    await createFoodAddon(
                        payload
                    );

                    setMessage(
                        "Add-on created successfully."
                    );

                }


                setEditingAddon(null);

                setForm(initialForm);

                await loadAddons(
                    selectedFood
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to save add-on."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleEdit =
        (addon) => {

            setEditingAddon(
                addon
            );

            setForm({

                name:
                    addon.name || "",

                price:
                    addon.price ?? "",

                available:
                    addon.available ?? true,

                displayOrder:
                    addon.displayOrder ?? "",

            });

            setMessage("");
            setError("");

        };


    const handleCancel =
        () => {

            setEditingAddon(null);

            setForm(initialForm);

            setError("");

        };


    const handleDelete =
        async (addonId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this add-on?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setSaving(true);

                setError("");
                setMessage("");

                await deleteFoodAddon(
                    addonId
                );

                setMessage(
                    "Add-on deleted successfully."
                );

                await loadAddons(
                    selectedFood
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to delete add-on."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (

            <main className="container">

                <p>
                    Loading add-on management...
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
                    Add-on Management
                </h1>

                <p>
                    Please create a restaurant first.
                </p>

            </main>

        );

    }


    return (

        <main className="container">

            <h1>
                Manage Food Add-ons
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


            <div className="card">

                <h2>
                    Select Restaurant
                </h2>

                <select
                    value={selectedRestaurant}
                    onChange={
                        handleRestaurantChange
                    }
                >

                    {restaurants.map(
                        (restaurant) => (

                            <option
                                key={restaurant.id}
                                value={restaurant.id}
                            >

                                {restaurant.name}

                            </option>

                        )
                    )}

                </select>

            </div>


            {categories.length > 0 && (

                <div className="card">

                    <h2>
                        Select Category
                    </h2>

                    <select
                        value={selectedCategory}
                        onChange={
                            handleCategoryChange
                        }
                    >

                        {categories.map(
                            (category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >

                                    {category.name}

                                </option>

                            )
                        )}

                    </select>

                </div>

            )}


            {foods.length > 0 && (

                <div className="card">

                    <h2>
                        Select Food
                    </h2>

                    <select
                        value={selectedFood}
                        onChange={
                            handleFoodChange
                        }
                    >

                        {foods.map(
                            (food) => (

                                <option
                                    key={food.id}
                                    value={food.id}
                                >

                                    {food.name}

                                </option>

                            )
                        )}

                    </select>

                </div>

            )}


            {selectedFood && (

                <form
                    className="card"
                    onSubmit={handleSubmit}
                >

                    <h2>

                        {editingAddon
                            ? "Edit Add-on"
                            : "Create Add-on"}

                    </h2>


                    <input
                        type="text"
                        name="name"
                        placeholder="Add-on Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />


                    <input
                        type="number"
                        name="displayOrder"
                        placeholder="Display Order"
                        value={form.displayOrder}
                        onChange={handleChange}
                        min="1"
                        required
                    />


                    <label>

                        <input
                            type="checkbox"
                            name="available"
                            checked={form.available}
                            onChange={handleChange}
                        />

                        Available

                    </label>


                    <button
                        type="submit"
                        className="primary"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : editingAddon
                                ? "Update Add-on"
                                : "Create Add-on"}

                    </button>


                    {editingAddon && (

                        <button
                            type="button"
                            onClick={handleCancel}
                        >

                            Cancel

                        </button>

                    )}

                </form>

            )}


            {selectedFood && (

                <section>

                    <h2>
                        Food Add-ons
                    </h2>


                    {addons.length === 0 ? (

                        <p>
                            No add-ons found for this food.
                        </p>

                    ) : (

                        <div className="grid">

                            {addons.map(
                                (addon) => (

                                    <div
                                        className="card"
                                        key={addon.id}
                                    >

                                        <h3>
                                            {addon.name}
                                        </h3>


                                        <p>
                                            Price: ₹{addon.price}
                                        </p>


                                        <p>
                                            Display Order:{" "}

                                            {addon.displayOrder}
                                        </p>


                                        <p>

                                            Status:{" "}

                                            {addon.available
                                                ? "Available"
                                                : "Unavailable"}

                                        </p>


                                        <button
                                            className="primary"
                                            onClick={() =>
                                                handleEdit(addon)
                                            }
                                        >

                                            Edit

                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(addon.id)
                                            }
                                            disabled={saving}
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