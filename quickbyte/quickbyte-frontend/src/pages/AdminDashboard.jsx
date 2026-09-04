import { Link } from "react-router-dom";

import {
    Building2,
    ClipboardList,
    Bike,
    Users,
    ShieldCheck,
    ArrowUpRight,
    Settings,
    UserCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function AdminDashboard() {

    const { user } = useAuth();


    const sections = [
        {
            name: "Restaurants",
            description:
                "Review, approve and manage restaurants on QuickByte.",
            path: "/admin/restaurants",
            icon: Building2,
        },
        {
            name: "Orders",
            description:
                "Monitor and manage customer orders across restaurants.",
            path: "/admin/orders",
            icon: ClipboardList,
        },
        {
            name: "Deliveries",
            description:
                "Track and manage delivery partners and deliveries.",
            path: "/admin/deliveries",
            icon: Bike,
        },
        {
            name: "Users",
            description:
                "View and manage customers, owners and platform users.",
            path: "/admin/users",
            icon: Users,
        },
    ];


    const adminName =
        user?.fullName ||
        user?.name ||
        "Admin";


    return (

        <main className="owner-dashboard-page">

            <div className="owner-dashboard-container">


                {/* =========================
                    HEADER
                ========================= */}

                <section className="owner-hero">

                    <div className="owner-hero-content">

                        <div className="owner-dashboard-badge">

                            <ShieldCheck size={16} />

                            ADMINISTRATION

                        </div>


                        <h1>

                            Welcome back,
                            <span> {adminName}</span>

                        </h1>


                        <p>

                            Manage restaurants, orders, deliveries
                            and users across the QuickByte platform.

                        </p>

                    </div>


                    <div className="owner-hero-icon">

                        <ShieldCheck size={42} />

                    </div>

                </section>


                {/* =========================
                    QUICK INFO
                ========================= */}

                <section className="owner-overview">


                    <div className="owner-overview-card">

                        <div className="owner-overview-icon">

                            <Building2 size={21} />

                        </div>

                        <div>

                            <span>
                                Restaurants
                            </span>

                            <strong>
                                Review & approve
                            </strong>

                        </div>

                    </div>


                    <div className="owner-overview-card">

                        <div className="owner-overview-icon">

                            <ClipboardList size={21} />

                        </div>

                        <div>

                            <span>
                                Orders
                            </span>

                            <strong>
                                Monitor activity
                            </strong>

                        </div>

                    </div>


                    <div className="owner-overview-card">

                        <div className="owner-overview-icon">

                            <Settings size={21} />

                        </div>

                        <div>

                            <span>
                                Administration
                            </span>

                            <strong>
                                Platform control
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    MANAGEMENT
                ========================= */}

                <section className="owner-management-section">


                    <div className="owner-section-heading">

                        <div>

                            <span>
                                ADMIN MANAGEMENT
                            </span>

                            <h2>
                                Manage QuickByte
                            </h2>

                            <p>
                                Monitor and manage the complete
                                QuickByte delivery platform.
                            </p>

                        </div>

                    </div>


                    <div className="owner-dashboard-grid">

                        {sections.map((section) => {

                            const Icon = section.icon;

                            return (

                                <Link
                                    key={section.name}
                                    to={section.path}
                                    className="owner-dashboard-card"
                                >

                                    <div className="owner-card-top">

                                        <div className="owner-card-icon">

                                            <Icon size={23} />

                                        </div>


                                        <ArrowUpRight
                                            size={19}
                                            className="owner-card-arrow"
                                        />

                                    </div>


                                    <div className="owner-card-content">

                                        <h3>
                                            {section.name}
                                        </h3>

                                        <p>
                                            {section.description}
                                        </p>

                                    </div>


                                    <div className="owner-card-footer">

                                        <span>
                                            Manage
                                        </span>

                                        <ArrowUpRight size={16} />

                                    </div>

                                </Link>

                            );

                        })}

                    </div>

                </section>


            </div>

        </main>

    );

}