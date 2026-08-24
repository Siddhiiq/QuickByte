import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { getOrder, cancelOrder } from "../api/orderApi";

export default function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setCancelling(true);
      setError("");

      await cancelOrder(id);

      const response = await getOrder(id);

      setOrder(response.data);

    } catch (e) {

      setError(
        e.response?.data?.message ||
        "Unable to cancel order."
      );

    } finally {

      setCancelling(false);

    }
  };

  useEffect(() => {

    getOrder(id)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((e) => {

        setError(
          e.response?.data?.message ||
          "Order not found."
        );

      });

  }, [id]);

  if (error) {

    return (
      <main className="container">

        <div className="error">
          {error}
        </div>

      </main>
    );

  }

  if (!order) {
    return <Loading />;
  }

  return (

    <main className="container">

      <div className="card">

        <h1>
          Order #{order.id}
        </h1>

        <p>
          Status:
          {" "}
          <strong>
            {order.orderStatus}
          </strong>
        </p>

        <p>
          Payment:
          {" "}
          <strong>
            {order.paymentStatus}
          </strong>
        </p>

        {order.orderStatus !== "CANCELLED" && (
          <button
            className="primary"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        <hr />

        <h2>
          Items
        </h2>

        {order.items?.map((item, index) => (

          <div
            key={index}
            className="orderItem"
          >

            <div>

              <strong>
                {item.foodName}
              </strong>

              <p>
                Variant: {item.variant}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

            </div>

            <strong>
              ₹{item.totalPrice}
            </strong>

          </div>

        ))}

        <hr />

        <div>
          <p>
            Subtotal:
            {" "}
            ₹{order.subTotal}
          </p>

          <p>
            Delivery Charge:
            {" "}
            ₹{order.deliveryCharge}
          </p>

          <p>
            Tax:
            {" "}
            ₹{order.tax}
          </p>

          <h2>
            Grand Total:
            {" "}
            ₹{order.grandTotal}
          </h2>

        </div>

        {order.notes && (

          <p>
            <strong>Notes:</strong>{" "}
            {order.notes}
          </p>

        )}

      </div>

    </main>

  );

}