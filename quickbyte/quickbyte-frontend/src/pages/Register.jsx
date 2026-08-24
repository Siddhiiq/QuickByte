import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";

export default function Register() {
  const [form, setForm] = useState({ fullName:"", email:"", password:"", phoneNumber:"", role:"CUSTOMER" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const change = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault(); setError("");
    try { await registerApi(form); navigate("/login"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
  };

  return <div className="authPage"><form className="card authCard" onSubmit={submit}>
    <h1>Create QuickByte account</h1>
    {error && <div className="error">{error}</div>}
    <label>Full name<input name="fullName" required value={form.fullName} onChange={change}/></label>
    <label>Email<input name="email" type="email" required value={form.email} onChange={change}/></label>
    <label>Phone<input name="phoneNumber" required value={form.phoneNumber} onChange={change}/></label>
    <label>Password<input name="password" type="password" minLength="8" required value={form.password} onChange={change}/></label>
    <label>Account type<select name="role" value={form.role} onChange={change}><option value="CUSTOMER">Customer</option><option value="RESTAURANT_OWNER">Restaurant Owner</option></select></label>
    <button className="primary">Register</button>
    <p>Already registered? <Link to="/login">Login</Link></p>
  </form></div>;
}
