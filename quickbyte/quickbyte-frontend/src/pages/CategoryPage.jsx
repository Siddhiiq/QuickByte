import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCategoriesByRestaurant } from "../api/categoryApi";
import { getFoodsByCategory } from "../api/foodApi";

import Loading from "../components/Loading";

export default function CategoryPage() {
  const { restaurantId } = useParams();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [foods, setFoods] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingFoods, setLoadingFoods] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * LOAD CATEGORIES
   */
  useEffect(() => {
    if (!restaurantId) return;

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
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

        const data = response.data;

        const categoryList =
          data?.content ||
          data ||
          [];

        setCategories(categoryList);

        if (categoryList.length > 0) {
          setSelectedCategory(
            categoryList[0]
          );
        } else {
          setSelectedCategory(null);
        }
      } catch (err) {
        console.error(
          "Category API error:",
          err
        );

        setCategories([]);
        setSelectedCategory(null);

        setError(
          err.response?.data?.message ||
          "Unable to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [restaurantId]);

  /*
   * LOAD FOODS
   */
  useEffect(() => {
    if (!selectedCategory?.id) {
      setFoods([]);
      return;
    }

    const loadFoods = async () => {
      try {
        setLoadingFoods(true);

        const response =
          await getFoodsByCategory(
            selectedCategory.id,
            {
              page: 0,
              size: 50,
              sortBy: "name",
            }
          );

        const data = response.data;

        const foodList =
          data?.content ||
          data ||
          [];

        setFoods(foodList);
      } catch (err) {
        console.error(
          "Food API error:",
          err
        );

        setFoods([]);
      } finally {
        setLoadingFoods(false);
      }
    };

    loadFoods();
  }, [selectedCategory]);

  if (loadingCategories) {
    return <Loading />;
  }

  return (
    <main className="container categoryPage">

      {/* HEADER */}

      <div className="categoryPageHeader">

        <Link
          to="/"
          className="backLink"
        >
          ← Back to restaurants
        </Link>

        <div className="categoryHeroText">

          <span className="sectionEyebrow">
            EXPLORE MENU
          </span>

          <h1>
            Discover your favourite food
          </h1>

          <p className="muted">
            Browse categories and discover
            delicious meals from this restaurant.
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* CATEGORIES */}

      {categories.length > 0 && (

        <section className="categorySection">

          <div className="categoryHeader">

            <div>
              <span className="sectionEyebrow">
                MENU
              </span>

              <h2>
                Categories
              </h2>
            </div>

            <span className="foodCount">
              {categories.length} categories
            </span>

          </div>

          <div className="categoryList">

            {categories.map(
              (category) => (

                <button
                  key={category.id}
                  type="button"
                  className={
                    selectedCategory?.id ===
                    category.id
                      ? "categoryChip active"
                      : "categoryChip"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  {category.name}
                </button>

              )
            )}

          </div>

        </section>

      )}

      {/* FOODS */}

      {selectedCategory && (

        <section className="foodSection">

          <div className="foodSectionHeader">

            <div>

              <span className="sectionEyebrow">
                {selectedCategory.name}
              </span>

              <h2>
                {selectedCategory.name}
              </h2>

              {selectedCategory.description && (
                <p className="muted">
                  {selectedCategory.description}
                </p>
              )}

            </div>

            <span className="foodCount">
              {foods.length} items
            </span>

          </div>

          {loadingFoods ? (
            <Loading />

          ) : foods.length > 0 ? (

            <div className="foodGrid">

              {foods.map(
                (food) => {

                  const image =
                    food.images?.find(
                      (item) =>
                        item?.imageUrl
                    )?.imageUrl ||
                    food.images?.[0]
                      ?.imageUrl;

                  return (

                    <Link
                      key={food.id}
                      to={`/foods/${food.id}`}
                      className="foodCardModern"
                    >

                      <div className="foodImage">

                        {image ? (

                          <img
                            src={image}
                            alt={food.name}
                            loading="lazy"
                          />

                        ) : (

                          <div className="foodImageFallback">
                            🍛
                          </div>

                        )}

                      </div>

                      <div className="foodInfo">

                        <div className="foodTopRow">

                          <h3>
                            {food.name}
                          </h3>

                          {food.foodType && (
                            <span className="foodType">
                              {food.foodType}
                            </span>
                          )}

                        </div>

                        <p className="foodDescription">

                          {food.description ||
                            "Delicious food prepared fresh for you."}

                        </p>

                        <div className="foodBottomRow">

                          <strong>
                            ₹
                            {food.price ??
                              0}
                          </strong>

                          <span className="rating">

                            ⭐{" "}

                            {food.averageRating
                              ? Number(
                                  food.averageRating
                                ).toFixed(1)
                              : "New"}

                          </span>

                        </div>

                      </div>

                    </Link>

                  );
                }
              )}

            </div>

          ) : (

            <div className="empty">

              <div className="emptyIcon">
                🍽️
              </div>

              <h3>
                No food items available
              </h3>

              <p>
                This category doesn't have
                any food items yet.
              </p>

            </div>

          )}

        </section>

      )}

      {!categories.length &&
        !error && (

          <div className="empty">

            <div className="emptyIcon">
              🍽️
            </div>

            <h3>
              No categories available
            </h3>

            <p>
              This restaurant hasn't added
              its menu yet.
            </p>

          </div>

        )}

    </main>
  );
}