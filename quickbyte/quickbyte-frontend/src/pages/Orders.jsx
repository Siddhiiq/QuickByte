import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomerOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

export default function Orders() {

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!user?.id) {
      setLoading(false);
      return;
    }

    getCustomerOrders(user.id)
      .then((response) => {

        const data =
          response.data?.content ||
          response.data ||
          [];

        setOrders(data);

      })
      .catch((e) => {

        setError(
          e.response?.data?.message ||
          "Unable to load orders."
        );

      })
      .finally(() => {
        setLoading(false);
      });

  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (

    <main className="container">

      <h1>My Orders</h1>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {orders.map((order) => (

        <Link
          className="orderCard"
          key={order.id}
          to={`/orders/${order.id}`}
        >

          <strong>
            Order #{order.id}
          </strong>

          <span>
            {order.orderStatus}
          </span>

          <span>
            ₹{order.grandTotal ?? "-"}
          </span>

        </Link>

      ))}

      {!orders.length && !error && (

        <div className="empty">
          No orders yet.
        </div>

      )}

    </main>

  );
}