import { useAuth } from "../context/AuthContext";
export default function Profile(){const{user}=useAuth();return <main className="container"><div className="card"><h1>Profile</h1><p><strong>Name:</strong> {user?.fullName||user?.name||"-"}</p><p><strong>Email:</strong> {user?.email||"-"}</p><p><strong>Role:</strong> {user?.role||"-"}</p><p><strong>ID:</strong> {user?.id||"-"}</p></div></main>}
