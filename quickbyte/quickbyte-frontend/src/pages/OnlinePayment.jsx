import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getPayment,
  markPaymentSuccess,
  markPaymentFailed
} from "../api/paymentApi";

import { useCart } from "../context/CartContext";


export default function OnlinePayment() {

  const { orderId } = useParams();

  const navigate = useNavigate();

  const { clearCart } = useCart();

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
   * Load payment information
   */
  useEffect(() => {

    const loadPayment = async () => {

      try {

        setLoading(true);

        const response =
          await getPayment(orderId);

        setPayment(
          response.data
        );

      } catch (err) {

        console.error(
          "Failed to load payment:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load payment."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPayment();

  }, [orderId]);


  /*
   * Mock successful payment
   *
   * Later this function will be replaced
   * with the real payment gateway callback.
   */
  const handlePaymentSuccess =
    async () => {

      try {

        setProcessing(true);

        setError("");


        const transactionId =
          `TXN-${Date.now()}`;

        const gatewayPaymentId =
          `QB-PAY-${Date.now()}`;


        await markPaymentSuccess(
          orderId,
          transactionId,
          gatewayPaymentId
        );


        /*
         * Payment succeeded.
         *
         * Now it is safe to clear
         * the customer's cart.
         */
        await clearCart();


        /*
         * Go to Orders.
         */
        navigate("/orders");

      } catch (err) {

        console.error(
          "Payment success processing failed:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Payment could not be completed."
        );

      } finally {

        setProcessing(false);

      }

    };


  /*
   * Mock failed payment
   */
  const handlePaymentFailed =
    async () => {

      try {

        setProcessing(true);

        setError("");


        await markPaymentFailed(
          orderId,
          "Payment cancelled or failed by customer."
        );


        /*
         * Do NOT clear the cart.
         *
         * Customer can retry payment.
         */
        navigate(
          `/payment/${orderId}`
        );

      } catch (err) {

        console.error(
          "Payment failure processing failed:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to process payment failure."
        );

      } finally {

        setProcessing(false);

      }

    };


  if (loading) {

    return (
      <main className="container">

        <h1>Payment</h1>

        <p>
          Loading payment...
        </p>

      </main>
    );

  }


  if (error && !payment) {

    return (
      <main className="container">

        <div className="error">
          {error}
        </div>

        <button
          className="primary"
          onClick={() =>
            navigate("/checkout")
          }
        >
          Back to Checkout
        </button>

      </main>
    );

  }


  return (
    <main className="container">

      <h1>Complete Payment</h1>


      {error && (
        <div className="error">
          {error}
        </div>
      )}


      <section className="checkoutSection">

        <h2>Payment Summary</h2>


        <p>

          Order ID:

          <strong>
            {" "}
            #{orderId}
          </strong>

        </p>


        <p>

          Payment Method:

          <strong>
            {" "}
            {payment?.paymentMethod}
          </strong>

        </p>


        <p>

          Amount:

          <strong>
            {" "}
            ₹
            {Number(
              payment?.amount || 0
            ).toFixed(2)}
          </strong>

        </p>

      </section>


      <section className="checkoutSection">

        <h2>Online Payment</h2>

        <p>
          This is the QuickByte development
          payment screen.
        </p>

        <p>
          In the production version, this
          screen will connect to a real payment
          gateway.
        </p>

      </section>


      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >

        <button
          className="primary"
          disabled={processing}
          onClick={
            handlePaymentSuccess
          }
        >

          {processing
            ? "Processing..."
            : `Pay ₹${Number(
                payment?.amount || 0
              ).toFixed(2)}`}

        </button>


        <button
          disabled={processing}
          onClick={
            handlePaymentFailed
          }
        >

          Cancel / Payment Failed

        </button>

      </div>

    </main>
  );
}