import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getFood,
  getFoodVariants,
  getFoodAddons,
  getFoodImages,
} from "../api/foodApi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const { addToCart } = useCart();


  const [food, setFood] = useState(null);
  const [variants, setVariants] = useState([]);
  const [addons, setAddons] = useState([]);
  const [images, setImages] = useState([]);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [selectedAddons, setSelectedAddons] =
    useState([]);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFood();
  }, [id]);

  const loadFood = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        foodResponse,
        variantsResponse,
        addonsResponse,
        imagesResponse,
      ] = await Promise.all([
        getFood(id),
        getFoodVariants(id),
        getFoodAddons(id),
        getFoodImages(id),
      ]);

      const foodData =
        foodResponse.data;

      const variantData =
        variantsResponse.data?.content ||
        variantsResponse.data ||
        [];

      const addonData =
        addonsResponse.data?.content ||
        addonsResponse.data ||
        [];

      const imageData =
        imagesResponse.data?.content ||
        imagesResponse.data ||
        [];

      setFood(foodData);
      setVariants(variantData);
      setAddons(addonData);
      setImages(imageData);

      const availableVariant =
        variantData.find(
          (variant) => {

            const available =
              variant.available !== false;

            const stock =
              Number(
                variant.stock ?? 1
              ) > 0;

            return (
              available &&
              stock
            );
          }
        );

      if (availableVariant) {
        setSelectedVariant(
          availableVariant
        );
      }

    } catch (err) {

      console.error(
        "Food details error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load food details."
      );

    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(
      (current) => {

        const exists =
          current.some(
            (item) =>
              item.id === addon.id
          );

        if (exists) {
          return current.filter(
            (item) =>
              item.id !== addon.id
          );
        }

        return [
          ...current,
          addon,
        ];
      }
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const increaseQuantity = () => {
    setQuantity(
      (current) =>
        current + 1
    );
  };

  const calculateUnitPrice = () => {

    if (selectedVariant) {
      return Number(
        selectedVariant.price || 0
      );
    }

    return Number(
      food?.price || 0
    );
  };

  const calculateAddonTotal = () =>
    selectedAddons.reduce(
      (total, addon) =>
        total +
        Number(
          addon.price || 0
        ),
      0
    );

  const unitPrice =
    calculateUnitPrice() +
    calculateAddonTotal();

  const totalPrice =
    unitPrice * quantity;

  const handleAddToCart = async () => {

    setMessage("");
    setError("");

    if (
      !isAuthenticated ||
      !user?.id
    ) {
      navigate("/login");
      return;
    }

    if (
      variants.length > 0 &&
      !selectedVariant
    ) {
      setError(
        "Please select a food variant."
      );
      return;
    }

    try {

      setAdding(true);

      const request = {

        userId: user.id,

        foodId: food.id,

        variantId:
          selectedVariant?.id ??
          null,

        quantity,

        addonIds:
          selectedAddons.map(
            (addon) =>
              addon.id
          ),

      };

      console.log(
        "ADD TO CART REQUEST:",
        request
      );

await addCartItem({
  foodId: food.id,
  variantId: selectedVariant?.id ?? null,
  quantity,
  addonIds: selectedAddons.map(
    (addon) => addon.id
  ),
});
      setMessage(
        "Added to cart successfully!"
      );

      setTimeout(() => {
        navigate("/cart");
      }, 700);

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to add this food to cart."
      );

    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !food) {
    return (
      <main className="container">
        <div className="error">
          {error}
        </div>
      </main>
    );
  }

  if (!food) {
    return (
      <main className="container">
        <div className="empty">
          Food not found.
        </div>
      </main>
    );
  }

  const mainImage =
    images?.[0]?.imageUrl ||
    food.images?.[0]?.imageUrl ||
    null;

  const rating =
    food.averageRating &&
    Number(food.averageRating) > 0
      ? Number(
          food.averageRating
        ).toFixed(1)
      : null;

  return (
    <main className="container foodPage">

      <button
        className="backButton"
        onClick={() =>
          navigate(-1)
        }
      >
        ← Back
      </button>

      <div className="foodDetails">

        <div className="foodDetailsImage">

          {mainImage ? (

            <img
              src={mainImage}
              alt={food.name}
            />

          ) : (

            <div className="foodPlaceholder">
              🍛
            </div>

          )}

          <div className="foodImageBadges">

            {food.bestSeller && (
              <span className="foodBadge bestSeller">
                🔥 Bestseller
              </span>
            )}

            {food.recommended && (
              <span className="foodBadge recommended">
                ⭐ Recommended
              </span>
            )}

          </div>

        </div>

        <div className="foodDetailsInfo">

          <div className="foodTitle">

            <span className="foodRestaurantLabel">
              QUICKBYTE FOOD
            </span>

            <h1>
              {food.name}
            </h1>

            <div className="foodMeta">

              <span className="foodTypeBadge">
                {food.foodType ||
                  "FOOD"}
              </span>

              {rating && (
                <span className="ratingBadge">
                  ⭐ {rating}
                </span>
              )}

              {food.totalReviews !==
                undefined && (
                <span className="reviewCount">
                  {food.totalReviews} reviews
                </span>
              )}

            </div>

          </div>

          <p className="foodDetailsDescription">
            {food.description ||
              "Delicious food prepared fresh for you."}
          </p>

          <div className="foodBasePrice">
            ₹{food.price ?? 0}
          </div>

          {variants.length > 0 && (

            <section className="selectionSection">

              <div className="selectionHeading">

                <div>
                  <h3>
                    Choose your variant
                  </h3>

                  <p>
                    Select your preferred size
                  </p>
                </div>

                <span className="requiredText">
                  Required
                </span>

              </div>

              <div className="variantList">

                {variants.map(
                  (variant) => {

                    const disabled =
                      variant.available ===
                        false ||
                      Number(
                        variant.stock ?? 1
                      ) <= 0;

                    const selected =
                      selectedVariant?.id ===
                      variant.id;

                    return (

                      <button
                        key={variant.id}
                        type="button"
                        disabled={disabled}
                        className={
                          selected
                            ? "variantOption selected"
                            : "variantOption"
                        }
                        onClick={() =>
                          setSelectedVariant(
                            variant
                          )
                        }
                      >

                        <span className="variantRadio">
                          {selected
                            ? "✓"
                            : ""}
                        </span>

                        <span className="variantName">
                          {variant.variantType}
                        </span>

                        <strong>
                          ₹{variant.price}
                        </strong>

                        {disabled && (
                          <small>
                            Out of stock
                          </small>
                        )}

                      </button>

                    );
                  }
                )}

              </div>

            </section>
          )}

          {addons.length > 0 && (

            <section className="selectionSection">

              <div className="selectionHeading">

                <div>
                  <h3>
                    Make it extra delicious
                  </h3>

                  <p>
                    Add your favourite extras
                  </p>
                </div>

                <span className="optionalText">
                  Optional
                </span>

              </div>

              <div className="addonList">

                {addons.map(
                  (addon) => {

                    const selected =
                      selectedAddons.some(
                        (item) =>
                          item.id ===
                          addon.id
                      );

                    const disabled =
                      addon.available ===
                      false;

                    return (

                      <label
                        key={addon.id}
                        className={
                          selected
                            ? "addonOption selected"
                            : "addonOption"
                        }
                      >

                        <input
                          type="checkbox"
                          disabled={
                            disabled
                          }
                          checked={
                            selected
                          }
                          onChange={() =>
                            toggleAddon(
                              addon
                            )
                          }
                        />

                        <span className="addonCheck">
                          {selected
                            ? "✓"
                            : ""}
                        </span>

                        <span className="addonName">
                          {addon.name}
                        </span>

                        <strong>
                          +₹{addon.price}
                        </strong>

                      </label>

                    );
                  }
                )}

              </div>

            </section>
          )}

          <section className="selectionSection">

            <div className="selectionHeading">

              <div>
                <h3>
                  Quantity
                </h3>

                <p>
                  How many would you like?
                </p>
              </div>

            </div>

            <div className="quantityControl">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
              >
                −
              </button>

              <strong>
                {quantity}
              </strong>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
              >
                +
              </button>

            </div>

          </section>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div className="success">
              ✓ {message}
            </div>
          )}

          <div className="foodDetailsBottom">

            <div className="foodTotalBox">

              <span className="muted">
                Total amount
              </span>

              <strong className="foodTotal">
                ₹{totalPrice.toFixed(2)}
              </strong>

            </div>

            <button
              className="primary addToCartButton"
              onClick={
                handleAddToCart
              }
              disabled={
                adding ||
                (
                  variants.length >
                    0 &&
                  !selectedVariant
                )
              }
            >
              {adding
                ? "Adding..."
                : "Add to Cart"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}