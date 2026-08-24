import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await loginApi(form);

      console.log("===== EXACT LOGIN RESPONSE =====");
      console.log(JSON.stringify(data, null, 2));

      login(data);

      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Login failed. Check email/password and backend URL."
      );
    }
  };

  return (
    <div className="authPage">
      <form
        className="card authCard"
        onSubmit={submit}
      >
        <h1>Welcome to QuickByte</h1>

        <p className="muted">
          Sign in to continue
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label>
          Email

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />
        </label>

        <label>
          Password

          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />
        </label>

        <button
          className="primary"
          type="submit"
        >
          Login
        </button>

        <p>
          New customer?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}