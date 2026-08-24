import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    items,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  if (!isAuthenticated) {
    return (
      <main className="container">
        <div className="cartLoginCard">
          <div className="cartEmptyIcon">
            🛒
          </div>

          <h1>Your cart is waiting</h1>

          <p>
            Login to view your cart and
            continue ordering delicious food.
          </p>

          <Link
            to="/login"
            className="primary inline"
          >
            Login to continue
          </Link>
        </div>
      </main>
    );
  }

  if (loading && !items.length) {
    return <Loading />;
  }

  if (!items.length) {
    return (
      <main className="container">
        <div className="cartEmptyCard">
          <div className="cartEmptyIcon">
            🛒
          </div>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/"
            className="primary inline"
          >
            Explore food
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Cart total comes from CartContext.
   */
  const deliveryCharge = total > 0 ? 40 : 0;

  const tax = total * 0.05;

  const grandTotal =
    total +
    deliveryCharge +
    tax;

  const handleQuantityChange = async (
    item,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      await updateQuantity(
        item.key,
        quantity
      );
    } catch (error) {
      console.error(
        "Quantity update failed:",
        error
      );
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(
        item.key
      );
    } catch (error) {
      console.error(
        "Remove cart item failed:",
        error
      );
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error(
        "Clear cart failed:",
        error
      );
    }
  };

  return (
    <main className="container cartPage">

      {/* =========================
          HEADER
      ========================= */}

      <div className="cartHeader">

        <div>
          <span className="muted">
            QuickByte
          </span>

          <h1>Your Cart</h1>

          <p>
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        <button
          type="button"
          className="clearCartButton"
          onClick={handleClearCart}
          disabled={loading}
        >
          Clear cart
        </button>

      </div>


      {/* =========================
          CART LAYOUT
      ========================= */}

      <div className="cartLayout">

        {/* =========================
            ITEMS
        ========================= */}

        <section className="cartItemsSection">

          {items.map((item) => {

            const quantity =
              Number(
                item.quantity || 1
              );

            const price =
              Number(
                item.price || 0
              );

            const itemTotal =
              price * quantity;

            return (
              <div
                className="cartProduct"
                key={item.key}
              >

                {/* IMAGE */}

                <div className="cartProductImage">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>
                      🍽️
                    </span>
                  )}

                </div>


                {/* PRODUCT CONTENT */}

                <div className="cartProductInfo">

                  <div className="cartProductTop">

                    <div className="cartProductDetails">

                      <h3>
                        {item.name}
                      </h3>

                      {item.variantName && (
                        <span className="cartVariant">
                          {item.variantName}
                        </span>
                      )}

                    </div>

                    <strong className="cartItemTotal">
                      ₹{itemTotal.toFixed(2)}
                    </strong>

                  </div>


                  {/* BOTTOM CONTROLS */}

                  <div className="cartProductBottom">

                    <span className="cartItemPrice">
                      ₹{price.toFixed(2)} each
                    </span>


                    <div className="cartQuantity">

                      <button
                        type="button"
                        className="cartQuantityButton"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity - 1
                          )
                        }
                        disabled={
                          loading ||
                          quantity <= 1
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="cartQuantityValue">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        className="cartQuantityButton"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity + 1
                          )
                        }
                        disabled={loading}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                    </div>


                    <button
                      type="button"
                      className="removeItemButton"
                      onClick={() =>
                        handleRemove(item)
                      }
                      disabled={loading}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            );
          })}


          <Link
            to="/"
            className="continueShopping"
          >
            ← Continue shopping
          </Link>

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="cartSummary">

          <h2>
            Order Summary
          </h2>


          <div className="summaryRow">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>

          </div>


          <div className="summaryRow">

            <span>
              Delivery fee
            </span>

            <strong>
              ₹{deliveryCharge.toFixed(2)}
            </strong>

          </div>


          <div className="summaryRow">

            <span>
              GST / Tax
            </span>

            <strong>
              ₹{tax.toFixed(2)}
            </strong>

          </div>


          <div className="summaryDivider" />


          <div className="summaryTotal">

            <span>
              Total
            </span>

            <strong>
              ₹{grandTotal.toFixed(2)}
            </strong>

          </div>


          <button
            type="button"
            className="primary checkoutButton"
            onClick={() =>
              navigate("/checkout")
            }
            disabled={loading}
          >
            Proceed to Checkout
          </button>


          <div className="secureCheckout">
            🔒 Secure checkout
          </div>

        </aside>

      </div>

    </main>
  );
}