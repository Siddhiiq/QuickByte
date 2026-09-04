import { useEffect, useState } from "react";

import { getMyRestaurants } from "../api/restaurantApi";

import {
    getCategoriesByRestaurant,
} from "../api/categoryApi";

import {
    getFoodsByCategory,
    createFood,
    updateFood,
} from "../api/foodApi";


const initialForm = {
    name: "",
    description: "",
    foodType: "VEG",
    preparationTime: "",
    categoryId: "",
    price: "",
    bestSeller: false,
    recommended: false,
};


export default function FoodManagement() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [
        selectedRestaurantId,
        setSelectedRestaurantId,
    ] = useState("");

    const [categories, setCategories] =
        useState([]);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("");

    const [foods, setFoods] =
        useState([]);

    const [form, setForm] =
        useState(initialForm);

    const [editingFood, setEditingFood] =
        useState(null);

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


    const loadRestaurants = async () => {

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

                const firstRestaurantId =
                    restaurantList[0].id;

                setSelectedRestaurantId(
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

                setError("");

                const response =
                    await getCategoriesByRestaurant(
                        restaurantId,
                        {
                            page: 0,
                            size: 50,
                            sortBy: "displayOrder",
                        }
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

                    const firstCategoryId =
                        categoryList[0].id;

                    setSelectedCategory(
                        String(firstCategoryId)
                    );

                    setForm(
                        (previous) => ({
                            ...previous,
                            categoryId:
                                String(firstCategoryId),
                        })
                    );

                    await loadFoods(
                        firstCategoryId
                    );

                } else {

                    setSelectedCategory("");
                    setFoods([]);

                }

            } catch (err) {

                setCategories([]);
                setFoods([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load categories."
                );

            }

        };


    const loadFoods =
        async (categoryId) => {

            try {

                setError("");

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

            } catch (err) {

                setFoods([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load foods."
                );

            }

        };


    const handleRestaurantChange =
        async (e) => {

            const restaurantId =
                e.target.value;

            setSelectedRestaurantId(
                restaurantId
            );

            setCategories([]);
            setFoods([]);

            setSelectedCategory("");

            setEditingFood(null);

            setForm(
                initialForm
            );

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

            setEditingFood(null);

            setForm({
                ...initialForm,
                categoryId,
            });

            setMessage("");
            setError("");

            if (categoryId) {

                await loadFoods(
                    categoryId
                );

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

            if (!selectedCategory) {

                setError(
                    "Please select a category."
                );

                return;

            }

            try {

                setSaving(true);

                setError("");
                setMessage("");

                const payload = {

                    name:
                    form.name,

                    description:
                    form.description,

                    foodType:
                    form.foodType,

                    preparationTime:
                        Number(
                            form.preparationTime
                        ),

                    categoryId:
                        Number(
                            selectedCategory
                        ),

                    price:
                        Number(
                            form.price
                        ),

                    bestSeller:
                    form.bestSeller,

                    recommended:
                    form.recommended,

                };


                if (editingFood) {

                    await updateFood(
                        editingFood.id,
                        payload
                    );

                    setMessage(
                        "Food updated successfully."
                    );

                } else {

                    await createFood(
                        payload
                    );

                    setMessage(
                        "Food created successfully."
                    );

                }


                setEditingFood(null);

                setForm({
                    ...initialForm,
                    categoryId:
                    selectedCategory,
                });

                await loadFoods(
                    selectedCategory
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to save food."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleEdit =
        (food) => {

            setEditingFood(
                food
            );

            setForm({

                name:
                    food.name || "",

                description:
                    food.description || "",

                foodType:
                    food.foodType || "VEG",

                preparationTime:
                    food.preparationTime ?? "",

                categoryId:
                    String(
                        selectedCategory
                    ),

                price:
                    food.price ?? "",

                bestSeller:
                    food.bestSeller ?? false,

                recommended:
                    food.recommended ?? false,

            });

            setMessage("");
            setError("");

        };


    const handleCancel =
        () => {

            setEditingFood(null);

            setForm({
                ...initialForm,
                categoryId:
                selectedCategory,
            });

            setError("");

        };


    if (loading) {

        return (

            <main className="container">

                <p>
                    Loading food management...
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
                    Food Management
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
                Manage Foods
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
                    value={selectedRestaurantId}
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


            {selectedCategory && (

                <form
                    className="card"
                    onSubmit={handleSubmit}
                >

                    <h2>

                        {editingFood
                            ? "Edit Food"
                            : "Create Food"}

                    </h2>


                    <input
                        name="name"
                        placeholder="Food Name"
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


                    <select
                        name="foodType"
                        value={form.foodType}
                        onChange={handleChange}
                    >

                        <option value="VEG">
                            Vegetarian
                        </option>

                        <option value="NON_VEG">
                            Non Vegetarian
                        </option>

                        <option value="EGG">
                            Egg
                        </option>

                    </select>


                    <input
                        type="number"
                        min="1"
                        name="preparationTime"
                        placeholder="Preparation Time (minutes)"
                        value={form.preparationTime}
                        onChange={handleChange}
                        required
                    />


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


                    <label>

                        <input
                            type="checkbox"
                            name="bestSeller"
                            checked={form.bestSeller}
                            onChange={handleChange}
                        />

                        Best Seller

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="recommended"
                            checked={form.recommended}
                            onChange={handleChange}
                        />

                        Recommended

                    </label>


                    <br />


                    <button
                        type="submit"
                        className="primary"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : editingFood
                                ? "Update Food"
                                : "Create Food"}

                    </button>


                    {editingFood && (

                        <button
                            type="button"
                            onClick={handleCancel}
                        >

                            Cancel

                        </button>

                    )}

                </form>

            )}


            {selectedCategory && (

                <section>

                    <h2>
                        Foods
                    </h2>


                    {foods.length === 0 ? (

                        <p>
                            No foods created in this category yet.
                        </p>

                    ) : (

                        <div className="grid">

                            {foods.map(
                                (food) => (

                                    <div
                                        className="card"
                                        key={food.id}
                                    >

                                        <h3>
                                            {food.name}
                                        </h3>


                                        <p>
                                            {food.description}
                                        </p>


                                        <p>
                                            <strong>
                                                Type:
                                            </strong>

                                            {" "}

                                            {food.foodType}
                                        </p>


                                        <p>
                                            <strong>
                                                Price:
                                            </strong>

                                            {" "}

                                            ₹{food.price}
                                        </p>


                                        <p>
                                            <strong>
                                                Preparation Time:
                                            </strong>

                                            {" "}

                                            {food.preparationTime} minutes
                                        </p>


                                        {food.bestSeller && (
                                            <p>
                                                ⭐ Best Seller
                                            </p>
                                        )}


                                        {food.recommended && (
                                            <p>
                                                👍 Recommended
                                            </p>
                                        )}


                                        <button
                                            className="primary"
                                            onClick={() =>
                                                handleEdit(food)
                                            }
                                        >

                                            Edit

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