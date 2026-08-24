import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Utensils,
  X,
} from "lucide-react";

import {
  getRestaurants,
  searchRestaurants,
} from "../api/restaurantApi";

import { getCategoriesByRestaurant } from "../api/categoryApi";
import { getFoodsByCategory } from "../api/foodApi";

const FOOD_IMAGES = {
  biryani:
    "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85",

  "fried rice":
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",

  pizza:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",

  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",

  noodles:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85",

  "chicken 65":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
};

const RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1000&q=85",
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90",
];

const FALLBACK_FOODS = [
  {
    id: "demo-biryani",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken and rich spices.",
    price: 220,
    foodType: "NON_VEG",
    rating: 4.7,
    imageUrl: FOOD_IMAGES.biryani,
  },
  {
    id: "demo-fried-rice",
    name: "Fried Rice",
    description: "Wok-tossed rice with vegetables, herbs and delicious seasoning.",
    price: 160,
    foodType: "VEG",
    rating: 4.5,
    imageUrl: FOOD_IMAGES["fried rice"],
  },
  {
    id: "demo-pizza",
    name: "Pizza",
    description: "Freshly baked pizza with a crispy base and melted cheese.",
    price: 249,
    foodType: "VEG",
    rating: 4.6,
    imageUrl: FOOD_IMAGES.pizza,
  },
  {
    id: "demo-burger",
    name: "Burger",
    description: "Juicy burger layered with fresh vegetables and signature sauce.",
    price: 189,
    foodType: "NON_VEG",
    rating: 4.4,
    imageUrl: FOOD_IMAGES.burger,
  },
  {
    id: "demo-noodles",
    name: "Noodles",
    description: "Hot wok-fried noodles with vegetables and aromatic sauces.",
    price: 170,
    foodType: "VEG",
    rating: 4.5,
    imageUrl: FOOD_IMAGES.noodles,
  },
  {
    id: "demo-chicken-65",
    name: "Chicken 65",
    description: "Crispy spicy chicken tossed with curry leaves and chillies.",
    price: 210,
    foodType: "NON_VEG",
    rating: 4.7,
    imageUrl: FOOD_IMAGES["chicken 65"],
  },
];

const CATEGORIES = [
  { name: "Biryani", icon: "🍛" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Noodles", icon: "🍜" },
  { name: "Fried Rice", icon: "🍚" },
  { name: "Chicken", icon: "🍗" },
  { name: "Desserts", icon: "🍰" },
  { name: "Drinks", icon: "🥤" },
];

function normalizeFood(food, index = 0) {
  const name = food?.name || food?.foodName || "Food Item";

  const normalizedName = name.toLowerCase();

  let imageUrl =
    food?.imageUrl ||
    food?.image ||
    food?.imageURL ||
    food?.foodImage ||
    "";

  Object.entries(FOOD_IMAGES).forEach(([key, url]) => {
    if (!imageUrl && normalizedName.includes(key)) {
      imageUrl = url;
    }
  });

  if (!imageUrl) {
    imageUrl =
      FOOD_IMAGES[
        Object.keys(FOOD_IMAGES)[index % Object.keys(FOOD_IMAGES).length]
      ];
  }

  return {
    ...food,
    id: food?.id ?? food?.foodId ?? `food-${index}`,
    name,
    description:
      food?.description ||
      "Delicious food freshly prepared by our restaurant partners.",
    price:
      food?.price ??
      food?.basePrice ??
      food?.startingPrice ??
      null,
    rating: food?.rating ?? food?.averageRating ?? 4.5,
    foodType: food?.foodType ?? food?.type ?? "",
    imageUrl,
  };
}

function normalizeRestaurant(restaurant, index = 0) {
  return {
    ...restaurant,
    id: restaurant?.id ?? restaurant?.restaurantId,
    name:
      restaurant?.name ||
      restaurant?.restaurantName ||
      "QuickByte Restaurant",
    description:
      restaurant?.description ||
      "Delicious meals delivered to your doorstep.",
    rating: restaurant?.rating ?? restaurant?.averageRating ?? 4.5,
    deliveryTime:
      restaurant?.deliveryTime ||
      restaurant?.estimatedDeliveryTime ||
      "25-35 min",
    imageUrl:
      restaurant?.imageUrl ||
      restaurant?.image ||
      RESTAURANT_IMAGES[index % RESTAURANT_IMAGES.length],
  };
}

export default function Home() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [activeHero, setActiveHero] = useState(0);

  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((current) => (current + 1) % HERO_IMAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      loadFoods();
    }
  }, [restaurants]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);

      const response = await getRestaurants();

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.content || [];

      setRestaurants(data.map(normalizeRestaurant));
    } catch (error) {
      console.error("Failed to load restaurants:", error);

      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFoods = async () => {
    try {
      setFoodLoading(true);

      const allFoods = [];

      for (const restaurant of restaurants.slice(0, 8)) {
        if (!restaurant.id) continue;

        try {
          const categoryResponse =
            await getCategoriesByRestaurant(restaurant.id);

          const categories = Array.isArray(categoryResponse?.data)
            ? categoryResponse.data
            : categoryResponse?.data?.content || [];

          for (const category of categories.slice(0, 8)) {
            if (!category?.id) continue;

            try {
              const foodResponse =
                await getFoodsByCategory(category.id);

              const categoryFoods = Array.isArray(foodResponse?.data)
                ? foodResponse.data
                : foodResponse?.data?.content || [];

              categoryFoods.forEach((food) => {
                const normalized = normalizeFood(
                  {
                    ...food,
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                  },
                  allFoods.length
                );

                if (
                  normalized.id &&
                  !allFoods.some(
                    (existing) => existing.id === normalized.id
                  )
                ) {
                  allFoods.push(normalized);
                }
              });
            } catch (foodError) {
              console.error(
                `Food loading failed for category ${category.id}`,
                foodError
              );
            }
          }
        } catch (categoryError) {
          console.error(
            `Category loading failed for restaurant ${restaurant.id}`,
            categoryError
          );
        }
      }

      setFoods(allFoods);
    } catch (error) {
      console.error("Food loading failed:", error);
      setFoods([]);
    } finally {
      setFoodLoading(false);
    }
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    const backendResults = foods.filter((food) => {
      const name = String(food.name || "").toLowerCase();
      const description = String(food.description || "").toLowerCase();
      const restaurant = String(
        food.restaurantName || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        restaurant.includes(query)
      );
    });

    /*
      The six demo search names are used only when the backend
      does not return a matching food. This keeps the homepage
      demonstrable while your actual backend data remains primary.
    */
    if (backendResults.length > 0) {
      return backendResults;
    }

    return FALLBACK_FOODS.filter((food) => {
      const name = food.name.toLowerCase();
      const description = food.description.toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });
  }, [searchQuery, foods]);

  const popularFoods = useMemo(() => {
    if (foods.length > 0) {
      return foods.slice(0, 8);
    }

    return FALLBACK_FOODS;
  }, [foods]);

  const displayedRestaurants = restaurants.slice(0, 5);

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      setSearchOpen(false);
      return;
    }

    setSearchOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleCategorySearch = (category) => {
    setSearchQuery(category);
    setSearchOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="hero-image-layer">
          {HERO_IMAGES.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Delicious food"
              className={
                index === activeHero
                  ? "hero-slide active"
                  : "hero-slide"
              }
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">

          <span className="hero-badge">
            <Bike size={15} />
            Fast delivery. Fresh food.
          </span>

          <h1>
            Great food,
            <br />
            <span>delivered to you.</span>
          </h1>

          <p>
            Discover delicious meals from your favourite
            restaurants and get them delivered right to your door.
          </p>

          <form
            className="home-search"
            onSubmit={handleSearch}
          >
            <Search size={21} />

            <input
              type="text"
              placeholder="Search biryani, pizza, burger, noodles..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="search-submit"
            >
              Search
            </button>
          </form>

          <div className="hero-features">
            <span>
              <Clock3 size={16} />
              25-35 min delivery
            </span>

            <span>
              <ShieldCheck size={16} />
              Secure ordering
            </span>

            <span>
              <MapPin size={16} />
              Local restaurants
            </span>
          </div>

        </div>

        <div className="hero-dots">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              className={
                index === activeHero
                  ? "hero-dot active"
                  : "hero-dot"
              }
              onClick={() => setActiveHero(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>

      </section>


      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      {searchOpen && (
        <section className="home-container search-results-section">

          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                SEARCH
              </span>

              <h2>
                Results for "{searchQuery}"
              </h2>

              <p>
                {searchResults.length} food
                {searchResults.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <button
              className="clear-search"
              onClick={clearSearch}
            >
              Clear search
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="search-empty">
              <div className="search-empty-image">
                🍽️
              </div>

              <h3>No foods found</h3>

              <p>
                Try Biryani, Fried Rice, Pizza, Burger,
                Noodles or Chicken 65.
              </p>

              <div className="search-suggestions">
                {[
                  "Biryani",
                  "Fried Rice",
                  "Pizza",
                  "Burger",
                  "Noodles",
                  "Chicken 65",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      handleCategorySearch(item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="food-grid-home">
              {searchResults.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                />
              ))}
            </div>
          )}

        </section>
      )}


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      {!searchOpen && (
        <div className="home-container">

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <section className="home-section">

            <div className="section-heading">

              <div>
                <span className="section-eyebrow">
                  EXPLORE
                </span>

                <h2>
                  What are you craving?
                </h2>

                <p>
                  Pick a category and discover something delicious.
                </p>
              </div>

            </div>

            <div className="category-grid-home">

              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  className="category-card-home"
                  onClick={() =>
                    handleCategorySearch(category.name)
                  }
                >
                  <span className="category-card-icon">
                    {category.icon}
                  </span>

                  <strong>
                    {category.name}
                  </strong>

                  <ChevronRight size={16} />
                </button>
              ))}

            </div>

          </section>


          {/* =================================================
              RESTAURANTS
          ================================================= */}

          <section className="home-section">

            <div className="section-heading">

              <div>
                <span className="section-eyebrow">
                  RESTAURANTS
                </span>

                <h2>
                  Popular near you
                </h2>

                <p>
                  Explore restaurants available on QuickByte.
                </p>
              </div>

              <Link
                to="/"
                className="see-all"
              >
                View all
                <ArrowRight size={16} />
              </Link>

            </div>

            {loading ? (
              <div className="home-loading">
                <div className="spinner" />
                Loading restaurants...
              </div>
            ) : displayedRestaurants.length === 0 ? (
              <div className="home-empty">
                <div>🏪</div>
                <h3>No restaurants available</h3>
                <p>
                  Restaurants will appear here once available.
                </p>
              </div>
            ) : (
              <div className="restaurant-grid-home">

                {displayedRestaurants.map(
                  (restaurant, index) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="restaurant-card-home"
                    >

                      <div className="restaurant-image-home">

                        <img
                          src={
                            restaurant.imageUrl ||
                            RESTAURANT_IMAGES[
                              index %
                                RESTAURANT_IMAGES.length
                            ]
                          }
                          alt={restaurant.name}
                        />

                        <span className="delivery-pill">
                          <Bike size={13} />
                          25-35 min
                        </span>

                      </div>

                      <div className="restaurant-info-home">

                        <div className="restaurant-name-row">

                          <h3>
                            {restaurant.name}
                          </h3>

                          <span className="rating-pill">
                            <Star size={13} fill="currentColor" />
                            {restaurant.rating}
                          </span>

                        </div>

                        <p>
                          {restaurant.description}
                        </p>

                        <div className="restaurant-card-footer">
                          <span>
                            <Clock3 size={14} />
                            {restaurant.deliveryTime}
                          </span>

                          <span>
                            <MapPin size={14} />
                            Nearby
                          </span>
                        </div>

                      </div>

                    </Link>
                  )
                )}

              </div>
            )}

          </section>


          {/* =================================================
              POPULAR FOODS
          ================================================= */}

          <section className="home-section">

            <div className="section-heading">

              <div>
                <span className="section-eyebrow">
                  POPULAR
                </span>

                <h2>
                  Customers are loving these
                </h2>

                <p>
                  Some of the most popular dishes on QuickByte.
                </p>
              </div>

            </div>

            {foodLoading ? (
              <div className="home-loading">
                <div className="spinner" />
                Loading delicious food...
              </div>
            ) : (
              <div className="food-grid-home">

                {popularFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                  />
                ))}

              </div>
            )}

          </section>


          {/* =================================================
              PROMO STRIP
          ================================================= */}

          <section className="promo-strip">

            <div className="promo-content">

              <span className="promo-label">
                QUICKBYTE SPECIAL
              </span>

              <h2>
                Your next favourite meal
                is just a few clicks away.
              </h2>

              <p>
                Search your favourite food, choose a restaurant,
                add it to your cart and enjoy.
              </p>

              <button
                className="promo-button"
                onClick={() =>
                  document
                    .querySelector(".home-search")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Start ordering
                <ArrowRight size={17} />
              </button>

            </div>

            <div className="promo-image">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
                alt="Fresh food"
              />
            </div>

          </section>


          {/* =================================================
              WHY QUICKBYTE
          ================================================= */}

          <section className="home-section why-section">

            <div className="section-heading centered">

              <div>
                <span className="section-eyebrow">
                  WHY QUICKBYTE
                </span>

                <h2>
                  Food delivery made simple
                </h2>

                <p>
                  Everything you need for a smooth ordering experience.
                </p>
              </div>

            </div>

            <div className="why-grid">

              <div className="why-card">
                <div className="why-icon">
                  <Search size={25} />
                </div>

                <h3>
                  Easy discovery
                </h3>

                <p>
                  Search your favourite dishes and discover
                  restaurants in seconds.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <ShoppingBag size={25} />
                </div>

                <h3>
                  Simple ordering
                </h3>

                <p>
                  Choose your food, customize your order
                  and checkout without unnecessary steps.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <Bike size={25} />
                </div>

                <h3>
                  Fast delivery
                </h3>

                <p>
                  Get your favourite meals delivered quickly
                  from local restaurant partners.
                </p>
              </div>

            </div>

          </section>


          {/* =================================================
              FINAL CTA
          ================================================= */}

          <section className="final-cta">

            <div>
              <span className="section-eyebrow">
                READY TO ORDER?
              </span>

              <h2>
                Hungry? Let's fix that.
              </h2>

              <p>
                Find something delicious and place your order.
              </p>
            </div>

            <button
              className="final-cta-button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              Explore food
              <ArrowRight size={18} />
            </button>

          </section>

        </div>
      )}

    </main>
  );
}


/* =========================================================
   FOOD CARD
========================================================= */

function FoodCard({ food }) {
  const image =
    food.imageUrl ||
    FOOD_IMAGES[
      Object.keys(FOOD_IMAGES)[
        Math.abs(Number(food.id) || 0) %
          Object.keys(FOOD_IMAGES).length
      ]
    ];

  return (
    <Link
      to={
        String(food.id).startsWith("demo-")
          ? "#"
          : `/foods/${food.id}`
      }
      className="food-card-home"
      onClick={(event) => {
        if (String(food.id).startsWith("demo-")) {
          event.preventDefault();
        }
      }}
    >

      <div className="food-image-home">

        <img
          src={image}
          alt={food.name}
        />

        <span className="food-image-overlay">
          <Utensils size={16} />
          Popular
        </span>

      </div>

      <div className="food-info-home">

        <div className="food-card-top">

          <span className="food-type">
            {food.foodType || "FOOD"}
          </span>

          <span className="food-rating">
            <Star
              size={13}
              fill="currentColor"
            />
            {food.rating || "4.5"}
          </span>

        </div>

        <h3>
          {food.name}
        </h3>

        <p>
          {food.description}
        </p>

        <div className="food-card-bottom">

          <strong>
            {food.price != null
              ? `₹${food.price}`
              : "View price"}
          </strong>

          <span className="food-view">
            View
            <ArrowRight size={15} />
          </span>

        </div>

      </div>

    </Link>
  );
}