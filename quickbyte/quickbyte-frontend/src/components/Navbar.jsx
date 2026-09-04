import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    User,
    LogOut,
    Package,
    Store,
    Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


export default function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();
    const { itemCount } = useCart();


    const handleLogout = () => {

        logout();

        navigate("/login");
    };


    const scrollToSection = (sectionId) => {

        const section =
            document.getElementById(sectionId);

        if (!section) {
            return;
        }

        /*
          Navbar height + small spacing
        */

        const navbarHeight = 90;

        const sectionPosition =
            section.getBoundingClientRect().top +
            window.scrollY;

        window.scrollTo({
            top: sectionPosition - navbarHeight,
            behavior: "smooth",
        });
    };


    const handleHome = (event) => {

        event.preventDefault();

        if (location.pathname !== "/") {

            navigate("/");

            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleRestaurants = (event) => {

        event.preventDefault();

        if (location.pathname !== "/") {

            navigate("/#restaurants");

            return;
        }

        scrollToSection("restaurants");
    };


    const handleSearch = (event) => {

        event.preventDefault();

        if (location.pathname !== "/") {

            navigate("/#search");

            return;
        }

        scrollToSection("search");

        setTimeout(() => {

            document
                .querySelector(".home-search input")
                ?.focus();

        }, 600);
    };


    return (

        <header className="navbar">

            <Link
                to="/"
                className="brand"
                onClick={handleHome}
            >

                <span className="brand-mark">
                    Q
                </span>

                <span>
                    Quick<span>Byte</span>
                </span>

            </Link>


            <nav className="navlinks">

                <Link
                    to="/"
                    onClick={handleHome}
                >
                    Home
                </Link>


                <Link
                    to="/#restaurants"
                    onClick={handleRestaurants}
                    className="nav-item"
                >
                    Restaurants
                </Link>


                <Link
                    to="/#search"
                    onClick={handleSearch}
                    className="nav-item"
                >

                    <Search size={16} />

                    Search

                </Link>


                {user &&
                    user.role === "CUSTOMER" && (

                        <>

                            <Link to="/orders">

                                <Package size={17} />

                                Orders

                            </Link>


                            <Link
                                to="/cart"
                                className="cart-link"
                            >

                                <ShoppingCart size={17} />

                                Cart


                                {itemCount > 0 && (

                                    <span className="cart-count">

                                        {itemCount}

                                    </span>

                                )}

                            </Link>

                        </>

                    )}


                {user &&
                    user.role === "RESTAURANT_OWNER" && (

                        <Link to="/owner">

                            <Store size={17} />

                            Owner

                        </Link>

                    )}


                {user &&
                    user.role === "ADMIN" && (

                        <Link to="/admin">

                            Admin

                        </Link>

                    )}


                {user ? (

                    <>

                        <Link
                            to="/profile"
                            className="nav-profile"
                        >

                            <User size={17} />

                            Profile

                        </Link>


                        <button
                            className="linkButton logout-button"
                            onClick={handleLogout}
                        >

                            <LogOut size={17} />

                            Logout

                        </button>

                    </>

                ) : (

                    <>

                        <Link to="/login">

                            Login

                        </Link>


                        <Link
                            to="/register"
                            className="nav-register"
                        >

                            Register

                        </Link>

                    </>

                )}

            </nav>

        </header>

    );
}