import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getRestaurant } from "../api/restaurantApi";
import { getCategoriesByRestaurant } from "../api/categoryApi";

import {
  getFoodsByCategory,
  getFoodVariants,
} from "../api/foodApi";

import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";

export default function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setError("");

        console.log("===== RESTAURANT LOAD START =====");
        console.log("Restaurant ID:", id);

        // ==========================================
        // 1. RESTAURANT
        // ==========================================

        const restaurantResponse = await getRestaurant(id);

        console.log(
          "Restaurant response:",
          restaurantResponse.status,
          restaurantResponse.data
        );

        setRestaurant(restaurantResponse.data);

        // ==========================================
        // 2. CATEGORIES
        // ==========================================

        const categoryResponse =
          await getCategoriesByRestaurant(id, {
            page: 0,
            size: 50,
            sortBy: "displayOrder",
          });

        const categoryData =
          categoryResponse.data?.content ||
          categoryResponse.data ||
          [];

        console.log("Categories:", categoryData);

        setCategories(categoryData);

        // ==========================================
        // 3. FOODS
        // ==========================================

        const foodResponses = await Promise.all(
          categoryData.map(async (category) => {
            try {
              const response = await getFoodsByCategory(
                category.id,
                {
                  page: 0,
                  size: 50,
                  sortBy: "name",
                }
              );

              return {
                categoryId: category.id,
                response,
              };
            } catch (foodError) {
              console.error(
                "Food loading failed:",
                category.id,
                foodError
              );

              return {
                categoryId: category.id,
                response: {
                  data: [],
                },
              };
            }
          })
        );

        // ==========================================
        // 4. MAP FOODS
        // ==========================================

        const allFoods = foodResponses.flatMap(
          ({ categoryId, response }) => {
            const foodData =
              response.data?.content ||
              response.data ||
              [];

            return foodData.map((food) => ({
              ...food,

              // Important:
              // keep category ID because backend
              // response may not contain it.
              categoryId:
                food.categoryId ||
                food.category?.id ||
                categoryId,
            }));
          }
        );

        console.log("ALL FOODS:", allFoods);

        // ==========================================
        // 5. LOAD VARIANTS
        // ==========================================

        const foodsWithVariants =
          await Promise.all(
            allFoods.map(async (food) => {
              try {
                const variantResponse =
                  await getFoodVariants(food.id);

                const variants =
                  variantResponse.data?.content ||
                  variantResponse.data ||
                  [];

                const availableVariant =
                  variants.find(
                    (variant) =>
                      variant.available !== false &&
                      Number(
                        variant.stock ?? 1
                      ) > 0
                  ) || variants[0];

                return {
                  ...food,

                  variantId:
                    availableVariant?.id,

                  variantPrice:
                    availableVariant?.price,

                  // Keep existing food images.
                  images:
                    food.images ||
                    [],
                };
              } catch (variantError) {
                console.error(
                  "Variant loading failed:",
                  food.id,
                  variantError
                );

                return {
                  ...food,
                  images: food.images || [],
                };
              }
            })
          );

        console.log(
          "===== FOODS WITH VARIANTS ====="
        );

        console.log(foodsWithVariants);

        setFoods(foodsWithVariants);

        console.log(
          "===== RESTAURANT LOAD COMPLETE ====="
        );
      } catch (e) {
        console.error(
          "===== RESTAURANT LOAD FAILED ====="
        );

        console.error(e);

        setError(
          e.response?.data?.message ||
            "Unable to load restaurant."
        );
      }
    };

    loadRestaurant();
  }, [id]);

  // ==========================================
  // LOADING / ERROR
  // ==========================================

  if (error) {
    return (
      <main className="container">
        <div className="error">{error}</div>
      </main>
    );
  }

  if (!restaurant) {
    return <Loading />;
  }

  // ==========================================
  // FILTER FOOD
  // ==========================================

  const displayedFoods = activeCategory
    ? foods.filter(
        (food) =>
          Number(food.categoryId) ===
          Number(activeCategory)
      )
    : foods;

  // ==========================================
  // RESTAURANT IMAGE
  // ==========================================

  const restaurantImage =
    restaurant.imageUrl ||
    restaurant.image ||
    restaurant.logoUrl ||
    restaurant.logo ||
    null;

  return (
    <main className="container restaurantDetailsPage">

      {/* ======================================
          BACK
      ====================================== */}

      <Link
        to="/"
        className="backLink"
      >
        ← Back to restaurants
      </Link>

      {/* ======================================
          RESTAURANT HERO
      ====================================== */}

      <section className="restaurantHero">

        <div className="restaurantHeroImage">

          {restaurantImage ? (
            <img
              src={restaurantImage}
              alt={restaurant.name}
            />
          ) : (
            <div className="restaurantImagePlaceholder">
              🍽️
            </div>
          )}

        </div>

        <div className="restaurantHeroContent">

          <span className="restaurantEyebrow">
            QUICKBYTE RESTAURANT
          </span>

          <h1>
            {restaurant.name}
          </h1>

          <p className="restaurantDescription">
            {restaurant.description ||
              "Fresh and delicious food prepared for you."}
          </p>

          <div className="restaurantMeta">

            {(restaurant.city ||
              restaurant.state) && (
              <span>
                📍{" "}
                {restaurant.city}
                {restaurant.state
                  ? `, ${restaurant.state}`
                  : ""}
              </span>
            )}

            <span>
              🍽️ {foods.length} menu items
            </span>

          </div>

        </div>

      </section>

      {/* ======================================
          MENU HEADER
      ====================================== */}

      <section className="restaurantMenu">

        <div className="menuHeading">

          <div>
            <span className="sectionEyebrow">
              MENU
            </span>

            <h2>
              Explore Categories
            </h2>

            <p>
              Choose your favourite food
              and enjoy a delicious meal.
            </p>
          </div>

          <div className="menuCount">
            {displayedFoods.length} items
          </div>

        </div>

        {/* ====================================
            CATEGORIES
        ==================================== */}

        <div className="categoryButtons">

          <button
            className={
              activeCategory === null
                ? "categoryButton active"
                : "categoryButton"
            }
            onClick={() =>
              setActiveCategory(null)
            }
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={
                Number(activeCategory) ===
                Number(category.id)
                  ? "categoryButton active"
                  : "categoryButton"
              }
              onClick={() =>
                setActiveCategory(
                  category.id
                )
              }
            >
              {category.name}
            </button>
          ))}

        </div>

      </section>

      {/* ======================================
          FOOD SECTION
      ====================================== */}

      <section className="restaurantFoodSection">

        <div className="foodSectionTitle">

          <div>
            <span className="sectionEyebrow">
              FRESH & DELICIOUS
            </span>

            <h2>
              Popular Menu
            </h2>
          </div>

          <span className="foodItemCount">
            {displayedFoods.length} items
          </span>

        </div>

        {/* ====================================
            FOOD GRID
        ==================================== */}

        {displayedFoods.length > 0 ? (

          <div className="restaurantFoodGrid">

            {displayedFoods.map((food) => {

              /*
               * Try every common image location
               * returned by the backend.
               */
              const foodImage =
                food.images?.[0]?.imageUrl ||
                food.images?.[0]?.url ||
                food.imageUrl ||
                food.image ||
                food.thumbnailUrl ||
                null;

              const price =
                food.variantPrice ??
                food.price ??
                0;

              return (
                <article
                  className="restaurantFoodCard"
                  key={food.id}
                >

                  {/* ==========================
                      FOOD IMAGE
                  ========================== */}

                  <Link
                    to={`/foods/${food.id}`}
                    className="restaurantFoodImage"
                  >

                    {foodImage ? (
                      <img
                        src={foodImage}
                        alt={food.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="foodImagePlaceholder">
                        🍛
                      </div>
                    )}

                    {food.bestSeller && (
                      <span className="foodBadge">
                        🔥 Bestseller
                      </span>
                    )}

                  </Link>

                  {/* ==========================
                      FOOD CONTENT
                  ========================== */}

                  <div className="restaurantFoodContent">

                    <div className="foodNameRow">

                      <Link
                        to={`/foods/${food.id}`}
                        className="restaurantFoodName"
                      >
                        {food.name}
                      </Link>

                      {food.foodType && (
                        <span className="restaurantFoodType">
                          {food.foodType}
                        </span>
                      )}

                    </div>

                    <p className="restaurantFoodDescription">
                      {food.description ||
                        "Delicious food prepared fresh for you."}
                    </p>

                    <div className="restaurantFoodBottom">

                      <div className="restaurantFoodPrice">
                        ₹{price}
                      </div>

                      {food.averageRating &&
                        Number(
                          food.averageRating
                        ) > 0 && (
                          <span className="restaurantFoodRating">
                            ⭐{" "}
                            {Number(
                              food.averageRating
                            ).toFixed(1)}
                          </span>
                        )}

                    </div>

                    {/* ======================
                        ADD BUTTON
                    ====================== */}

                    <button
                      className="restaurantAddButton"
                      onClick={async () => {

                        try {

                          console.log(
                            "===== ADD FOOD ====="
                          );

                          const variantResponse =
                            await getFoodVariants(
                              food.id
                            );

                          const variants =
                            variantResponse.data
                              ?.content ||
                            variantResponse.data ||
                            [];

                          if (!variants.length) {
                            alert(
                              "No available variant found for this food."
                            );
                            return;
                          }

                          const variant =
                            variants.find(
                              (item) =>
                                item.available !==
                                  false &&
                                Number(
                                  item.stock ?? 1
                                ) > 0
                            ) ||
                            variants.find(
                              (item) =>
                                item.available !==
                                false
                            );

                          if (!variant) {
                            alert(
                              "This food is currently unavailable."
                            );
                            return;
                          }

                          await addToCart({
                            foodId: food.id,
                            variantId: variant.id,
                            name: food.name,
                            price:
                              variant.price ??
                              food.variantPrice ??
                              food.price,
                            restaurantId: id,
                            quantity: 1,
                          });

                          alert(
                            `${food.name} added to cart!`
                          );

                        } catch (error) {

                          console.error(
                            "Add to cart failed:",
                            error
                          );

                          alert(
                            error.response?.data
                              ?.message ||
                              "Unable to add item to cart."
                          );
                        }

                      }}
                    >
                      Add
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        ) : (

          <div className="empty">
            No menu items found.
          </div>

        )}

      </section>

    </main>
  );
}