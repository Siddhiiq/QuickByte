import { useEffect, useState } from "react";
import { getMyRestaurant } from "../api/restaurantApi";
import {
    getCategoriesByRestaurant,
    createCategory,
    updateCategory,
} from "../api/categoryApi";

const initialForm = {
    name: "",
    description: "",
    displayOrder: "",
};

export default function CategoryManagement() {
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingCategory, setEditingCategory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            // Get the restaurant owned by the logged-in owner
            const restaurantResponse = await getMyRestaurant();

            const myRestaurant = restaurantResponse.data;

            setRestaurant(myRestaurant);

            // Get categories belonging to this restaurant
            const categoryResponse =
                await getCategoriesByRestaurant(
                    myRestaurant.id
                );

            setCategories(
                categoryResponse.data.content || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
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
                restaurantId: restaurant.id,
                name: form.name,
                description: form.description,
                displayOrder: Number(form.displayOrder),
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

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);

        setForm({
            name: category.name || "",
            description: category.description || "",
            displayOrder:
                category.displayOrder || "",
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

    if (!restaurant) {
        return (
            <main className="container">
                <h1>Categories</h1>
                <p>No restaurant found for this owner.</p>
            </main>
        );
    }

    return (
        <main className="container">
            <h1>Manage Categories</h1>

            <p>
                Restaurant: <strong>{restaurant.name}</strong>
            </p>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            {/* CREATE / UPDATE FORM */}
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

            {/* CATEGORY LIST */}
            <section>
                <h2>My Categories</h2>

                {categories.length === 0 ? (
                    <p>No categories created yet.</p>
                ) : (
                    <div className="grid">
                        {categories.map((category) => (
                            <div
                                className="card"
                                key={category.id}
                            >
                                <h3>{category.name}</h3>

                                {category.description && (
                                    <p>{category.description}</p>
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
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}