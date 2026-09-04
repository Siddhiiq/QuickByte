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
    getVariantsByFood,
    createFoodVariant,
    updateFoodVariant,
    deleteFoodVariant,
} from "../api/foodVariantApi";


const initialForm = {
    variantType: "HALF",
    price: "",
    stock: "",
};


export default function VariantManagement() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [
        selectedRestaurant,
        setSelectedRestaurant,
    ] = useState("");

    const [categories, setCategories] =
        useState([]);

    const [foods, setFoods] =
        useState([]);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("");

    const [
        selectedFood,
        setSelectedFood,
    ] = useState("");

    const [variants, setVariants] =
        useState([]);

    const [form, setForm] =
        useState(initialForm);

    const [
        editingVariant,
        setEditingVariant,
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


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

                setRestaurants(restaurantList);

                if (
                    restaurantList.length > 0
                ) {

                    const firstRestaurantId =
                        restaurantList[0].id;

                    setSelectedRestaurant(
                        String(firstRestaurantId)
                    );

                    await loadCategories(
                        firstRestaurantId
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

                setCategories(categoryList);

                if (
                    categoryList.length > 0
                ) {

                    const firstCategoryId =
                        categoryList[0].id;

                    setSelectedCategory(
                        String(firstCategoryId)
                    );

                    await loadFoods(
                        firstCategoryId
                    );

                } else {

                    setSelectedCategory("");
                    setSelectedFood("");
                    setFoods([]);
                    setVariants([]);

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

                setFoods(foodList);

                if (foodList.length > 0) {

                    const firstFoodId =
                        foodList[0].id;

                    setSelectedFood(
                        String(firstFoodId)
                    );

                    await loadVariants(
                        firstFoodId
                    );

                } else {

                    setSelectedFood("");
                    setVariants([]);

                }

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load foods."
                );

            }

        };


    const loadVariants =
        async (foodId) => {

            try {

                const response =
                    await getVariantsByFood(
                        foodId
                    );

                const variantList =
                    response.data?.content ||
                    response.data ||
                    [];

                setVariants(variantList);

            } catch (err) {

                setVariants([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load variants."
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
            setVariants([]);

            setSelectedCategory("");
            setSelectedFood("");

            setEditingVariant(null);
            setForm(initialForm);

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

            setSelectedCategory(categoryId);

            setSelectedFood("");
            setFoods([]);
            setVariants([]);

            setEditingVariant(null);
            setForm(initialForm);

            if (categoryId) {

                await loadFoods(categoryId);

            }

        };


    const handleFoodChange =
        async (e) => {

            const foodId = e.target.value;

            setSelectedFood(foodId);

            setEditingVariant(null);
            setForm(initialForm);

            if (foodId) {

                await loadVariants(foodId);

            } else {

                setVariants([]);

            }

        };


    const handleChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setForm(
                (previous) => ({
                    ...previous,
                    [name]: value,
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

                    variantType:
                    form.variantType,

                    price:
                        Number(form.price),

                    stock:
                        Number(form.stock),

                };


                if (editingVariant) {

                    await updateFoodVariant(
                        editingVariant.id,
                        payload
                    );

                    setMessage(
                        "Variant updated successfully."
                    );

                } else {

                    await createFoodVariant(
                        payload
                    );

                    setMessage(
                        "Variant created successfully."
                    );

                }


                setEditingVariant(null);
                setForm(initialForm);

                await loadVariants(
                    selectedFood
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to save variant."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleEdit =
        (variant) => {

            setEditingVariant(variant);

            setForm({

                variantType:
                    variant.variantType ||
                    "HALF",

                price:
                    variant.price ?? "",

                stock:
                    variant.stock ?? "",

            });

        };


    const handleCancel = () => {

        setEditingVariant(null);
        setForm(initialForm);

    };


    const handleDelete =
        async (variantId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this variant?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setSaving(true);

                setError("");

                await deleteFoodVariant(
                    variantId
                );

                setMessage(
                    "Variant deleted successfully."
                );

                await loadVariants(
                    selectedFood
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to delete variant."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (
            <main className="container">
                <p>
                    Loading variant management...
                </p>
            </main>
        );

    }


    if (restaurants.length === 0) {

        return (
            <main className="container">

                <h1>
                    Variant Management
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
                Manage Food Variants
            </h1>


            {message && (
                <p>{message}</p>
            )}


            {error && (
                <p>{error}</p>
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

                        {editingVariant
                            ? "Edit Variant"
                            : "Create Variant"}

                    </h2>


                    <select
                        name="variantType"
                        value={form.variantType}
                        onChange={handleChange}
                    >

                        <option value="HALF">
                            Half
                        </option>

                        <option value="FULL">
                            Full
                        </option>

                        <option value="JUMBO">
                            Jumbo
                        </option>

                        <option value="FAMILY_PACK">
                            Family Pack
                        </option>

                    </select>


                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="number"
                        min="0"
                        name="stock"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />


                    <button
                        type="submit"
                        className="primary"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : editingVariant
                                ? "Update Variant"
                                : "Create Variant"}

                    </button>


                    {editingVariant && (

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
                        Food Variants
                    </h2>


                    {variants.length === 0 ? (

                        <p>
                            No variants created for this
                            food yet.
                        </p>

                    ) : (

                        <div className="grid">

                            {variants.map(
                                (variant) => (

                                    <div
                                        className="card"
                                        key={variant.id}
                                    >

                                        <h3>
                                            {variant.variantType}
                                        </h3>

                                        <p>
                                            Price: ₹
                                            {variant.price}
                                        </p>

                                        <p>
                                            Stock:{" "}
                                            {variant.stock}
                                        </p>

                                        <p>
                                            Status:{" "}

                                            {variant.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </p>


                                        <button
                                            className="primary"
                                            onClick={() =>
                                                handleEdit(
                                                    variant
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    variant.id
                                                )
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