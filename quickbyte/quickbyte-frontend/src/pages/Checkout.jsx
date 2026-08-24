import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  useAuth,
} from "../context/AuthContext";

import {
  createOrder,
} from "../api/orderApi";

import {
  createPayment,
} from "../api/paymentApi";

import Loading from "../components/Loading";


export default function Checkout() {

  const {
    items,
    total,
    clearCart,
    reloadCart,
    loading: cartLoading,
  } = useCart();

  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();


  const [
    address,
    setAddress,
  ] = useState("");


  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    "CASH_ON_DELIVERY"
  );


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /*
   * ========================================
   * RELOAD CART WHEN CHECKOUT OPENS
   * ========================================
   */

  useEffect(() => {

    const refreshCart =
      async () => {

        try {

          await reloadCart();

        } catch (err) {

          console.error(
            "Failed to refresh checkout cart:",
            err
          );

          setError(
            "Unable to load your cart."
          );
        }
      };

    if (user?.id) {
      refreshCart();
    }

  }, [user?.id]);


  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (
    cartLoading &&
    !items.length
  ) {
    return <Loading />;
  }


  /*
   * ========================================
   * EMPTY CART
   * ========================================
   */

  if (!items.length) {

    return (
      <main className="container">

        <div className="checkoutEmpty">

          <div className="cartEmptyIcon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some delicious food
            before continuing to checkout.
          </p>

          <button
            type="button"
            className="primary"
            onClick={() =>
              navigate("/")
            }
          >
            Browse Restaurants
          </button>

        </div>

      </main>
    );
  }


  /*
   * ========================================
   * TOTALS
   * ========================================
   */

  const deliveryFee =
    40;

  const tax =
    total * 0.05;

  const grandTotal =
    total +
    deliveryFee +
    tax;


  /*
   * ========================================
   * PLACE ORDER
   * ========================================
   */

  const handlePlaceOrder =
    async () => {

      setError("");


      if (!user?.id) {

        setError(
          "Please login before placing an order."
        );

        return;
      }


      if (!address.trim()) {

        setError(
          "Please enter your delivery address."
        );

        return;
      }


      const orderRequest = {

        customerId:
          user.id,

        street:
          address,

        area:
          "N/A",

        landmark:
          "",

        city:
          "Chennai",

        district:
          "Chennai",

        state:
          "Tamil Nadu",

        country:
          "India",

        pincode:
          "600000",

        latitude:
          13.0827,

        longitude:
          80.2707,

        notes:
          `Payment Method: ${paymentMethod}`,

      };


      try {

        setLoading(true);


        /*
         * STEP 1
         * CREATE ORDER
         */

        const orderResponse =
          await createOrder(
            orderRequest
          );


        const createdOrder =
          orderResponse.data;


        if (!createdOrder?.id) {

          throw new Error(
            "Order was created but no order ID was returned."
          );
        }


        console.log(
          "Order created:",
          createdOrder
        );


        /*
         * STEP 2
         * CREATE PAYMENT RECORD
         */

        const paymentRequest = {

          orderId:
            createdOrder.id,

          paymentMethod:
            paymentMethod,

        };


        await createPayment(
          paymentRequest
        );


        /*
         * STEP 3
         * CASH ON DELIVERY
         */

        if (
          paymentMethod ===
          "CASH_ON_DELIVERY"
        ) {

          await clearCart();

          navigate(
            "/orders"
          );

          return;
        }


        /*
         * STEP 4
         * ONLINE PAYMENT
         */

        navigate(
          `/payment/${createdOrder.id}`
        );

      } catch (err) {

        console.error(
          "Checkout failed:",
          err
        );

        console.error(
          "Backend response:",
          err.response?.data
        );


        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to continue checkout. Please try again."
        );

      } finally {

        setLoading(false);

      }
    };


  /*
   * ========================================
   * UI
   * ========================================
   */

  return (
    <main className="container checkoutPage">

      <div className="checkoutHeader">

        <span className="muted">
          QuickByte
        </span>

        <h1>
          Checkout
        </h1>

        <p>
          Review your order and
          complete your purchase.
        </p>

      </div>


      {error && (
        <div className="error">
          {error}
        </div>
      )}


      <div className="checkoutLayout">

        {/* =========================
            LEFT
        ========================= */}

        <div className="checkoutMain">

          {/* DELIVERY */}

          <section className="checkoutSection">

            <h2>
              Delivery Address
            </h2>

            <p className="checkoutSectionText">
              Where should we deliver
              your order?
            </p>

            <textarea
              rows="4"
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

          </section>


          {/* PAYMENT */}

          <section className="checkoutSection">

            <h2>
              Payment Method
            </h2>

            <div className="paymentOptions">

              <label className="paymentOption">

                <input
                  type="radio"
                  value="CASH_ON_DELIVERY"
                  checked={
                    paymentMethod ===
                    "CASH_ON_DELIVERY"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Cash on Delivery
                </span>

              </label>


              <label className="paymentOption">

                <input
                  type="radio"
                  value="UPI"
                  checked={
                    paymentMethod ===
                    "UPI"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  UPI
                </span>

              </label>


              <label className="paymentOption">

                <input
                  type="radio"
                  value="CREDIT_CARD"
                  checked={
                    paymentMethod ===
                    "CREDIT_CARD"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Credit Card
                </span>

              </label>


              <label className="paymentOption">

                <input
                  type="radio"
                  value="DEBIT_CARD"
                  checked={
                    paymentMethod ===
                    "DEBIT_CARD"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Debit Card
                </span>

              </label>


              <label className="paymentOption">

                <input
                  type="radio"
                  value="NET_BANKING"
                  checked={
                    paymentMethod ===
                    "NET_BANKING"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Net Banking
                </span>

              </label>


              <label className="paymentOption">

                <input
                  type="radio"
                  value="WALLET"
                  checked={
                    paymentMethod ===
                    "WALLET"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Wallet
                </span>

              </label>

            </div>

          </section>

        </div>


        {/* =========================
            RIGHT SUMMARY
        ========================= */}

        <aside className="checkoutSummary">

          <h2>
            Order Summary
          </h2>


          <div className="checkoutItems">

            {items.map(
              (item) => {

                const itemTotal =
                  Number(
                    item.price || 0
                  ) *
                  Number(
                    item.quantity || 0
                  );

                return (
                  <div
                    className="checkoutItem"
                    key={item.key}
                  >

                    <div className="checkoutItemInfo">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        ₹
                        {Number(
                          item.price
                        ).toFixed(2)}
                        {" × "}
                        {item.quantity}
                      </span>

                    </div>

                    <strong>
                      ₹
                      {itemTotal.toFixed(
                        2
                      )}
                    </strong>

                  </div>
                );

              }
            )}

          </div>


          <div className="summaryDivider" />


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
              Delivery Fee
            </span>

            <strong>
              ₹{deliveryFee.toFixed(2)}
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


          <div className="checkoutGrandTotal">

            <span>
              Total
            </span>

            <strong>
              ₹{grandTotal.toFixed(2)}
            </strong>

          </div>


          <button
            type="button"
            className="primary checkoutPlaceOrder"
            disabled={
              loading ||
              cartLoading
            }
            onClick={
              handlePlaceOrder
            }
          >

            {loading
              ? "Processing..."
              : paymentMethod ===
                "CASH_ON_DELIVERY"
              ? "Place Order"
              : `Pay ₹${grandTotal.toFixed(
                  2
                )} & Continue`}

          </button>


          <div className="secureCheckout">
            🔒 Secure checkout
          </div>

        </aside>

      </div>

    </main>
  );
}