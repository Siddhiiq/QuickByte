import {
    useEffect,
    useState,
} from "react";

import {
    getMyRestaurants,
} from "../api/restaurantApi";

import {
    getCategoriesByRestaurant,
    createCategory,
    updateCategory,
} from "../api/categoryApi";

import RestaurantSelector
    from "../components/RestaurantSelector";


const initialForm = {
    name: "",
    description: "",
    displayOrder: "",
};


export default function CategoryManagement() {

    const [
        restaurants,
        setRestaurants,
    ] = useState([]);

    const [
        selectedRestaurantId,
        setSelectedRestaurantId,
    ] = useState("");

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        form,
        setForm,
    ] = useState(initialForm);

    const [
        editingCategory,
        setEditingCategory,
    ] = useState(null);

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


    useEffect(() => {
        loadRestaurants();
    }, []);


    useEffect(() => {

        if (!selectedRestaurantId) {
            setCategories([]);
            return;
        }

        loadCategories(selectedRestaurantId);

    }, [selectedRestaurantId]);


    const loadRestaurants = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyRestaurants();

            const restaurantList =
                response.data || [];

            setRestaurants(restaurantList);

            if (restaurantList.length > 0) {

                setSelectedRestaurantId(
                    String(restaurantList[0].id)
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

                setCategories(categoryList);

            } catch (err) {

                setCategories([]);

                setError(
                    err.response?.data?.message ||
                    "Failed to load categories."
                );

            }

        };


    const handleRestaurantChange =
        (restaurantId) => {

            setSelectedRestaurantId(restaurantId);

            setCategories([]);

            setEditingCategory(null);

            setForm(initialForm);

            setMessage("");
            setError("");

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

            if (!selectedRestaurantId) {

                setError(
                    "Please select a restaurant."
                );

                return;
            }

            try {

                setSaving(true);

                setError("");
                setMessage("");

                const payload = {

                    restaurantId:
                        Number(selectedRestaurantId),

                    name:
                    form.name,

                    description:
                    form.description,

                    displayOrder:
                        Number(form.displayOrder),

                };


                if (editingCategory) {

                    await updateCategory(
                        editingCategory.id,
                        payload
                    );

                    setMessage(
                        "Category updated successfully."
                    );

                } else {

                    await createCategory(payload);

                    setMessage(
                        "Category created successfully."
                    );

                }


                setForm(initialForm);

                setEditingCategory(null);

                await loadCategories(
                    selectedRestaurantId
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to save category."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleEdit =
        (category) => {

            setEditingCategory(category);

            setForm({
                name:
                    category.name || "",

                description:
                    category.description || "",

                displayOrder:
                    category.displayOrder ?? "",
            });

            setMessage("");
            setError("");

        };


    const handleCancel = () => {

        setEditingCategory(null);

        setForm(initialForm);

        setError("");

    };


    if (loading) {

        return (
            <main className="container">
                <p>Loading categories...</p>
            </main>
        );

    }


    if (restaurants.length === 0) {

        return (
            <main className="container">

                <h1>Manage Categories</h1>

                <p>
                    No restaurants found for this owner.
                </p>

            </main>
        );

    }


    return (

        <main className="container">

            <h1>Manage Categories</h1>

            <RestaurantSelector
                restaurants={restaurants}
                selectedRestaurantId={
                    selectedRestaurantId
                }
                onChange={handleRestaurantChange}
            />


            {message && (
                <p>{message}</p>
            )}


            {error && (
                <p>{error}</p>
            )}


            {selectedRestaurantId && (

                <form
                    className="card"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        {editingCategory
                            ? "Edit Category"
                            : "Create Category"}
                    </h2>


                    <input
                        name="name"
                        placeholder="Category Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />


                    <input
                        type="number"
                        min="1"
                        name="displayOrder"
                        placeholder="Display Order"
                        value={form.displayOrder}
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
                            : editingCategory
                                ? "Update Category"
                                : "Create Category"}
                    </button>


                    {editingCategory && (

                        <button
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            )}


            <section>

                <h2>Categories</h2>


                {categories.length === 0 ? (

                    <p>
                        No categories created for this
                        restaurant yet.
                    </p>

                ) : (

                    <div className="grid">

                        {categories.map(
                            (category) => (

                                <div
                                    className="card"
                                    key={category.id}
                                >

                                    <h3>
                                        {category.name}
                                    </h3>


                                    {category.description && (
                                        <p>
                                            {category.description}
                                        </p>
                                    )}


                                    <p>
                                        Display Order:{" "}
                                        {category.displayOrder}
                                    </p>


                                    <button
                                        className="primary"
                                        onClick={() =>
                                            handleEdit(category)
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

        </main>

    );

}