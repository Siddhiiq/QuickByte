import {
    Mail,
    User,
    ShieldCheck,
    Hash,
    Store,
    CircleUserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function Profile() {

    const { user } = useAuth();


    const userName =
        user?.fullName ||
        user?.name ||
        "QuickByte User";


    const userRole =
        user?.role ||
        "USER";


    const getRoleLabel = () => {

        if (userRole === "RESTAURANT_OWNER") {
            return "Restaurant Owner";
        }

        if (userRole === "CUSTOMER") {
            return "Customer";
        }

        if (userRole === "ADMIN") {
            return "Administrator";
        }

        return userRole;
    };


    const getInitials = () => {

        return userName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

    };


    return (

        <main className="profile-page">

            <div className="profile-container">


                {/* =========================
                    PROFILE HEADER
                ========================= */}

                <section className="profile-hero">

                    <div className="profile-avatar">

                        {getInitials()}

                    </div>


                    <div className="profile-hero-content">

                        <span className="profile-eyebrow">

                            <CircleUserRound size={16} />

                            MY PROFILE

                        </span>


                        <h1>
                            {userName}
                        </h1>


                        <p>
                            Manage and view your QuickByte account details.
                        </p>

                    </div>

                </section>


                {/* =========================
                    ACCOUNT CARD
                ========================= */}

                <section className="profile-details-card">


                    <div className="profile-section-heading">

                        <div>

                            <span>
                                ACCOUNT DETAILS
                            </span>

                            <h2>
                                Personal information
                            </h2>

                        </div>

                    </div>


                    <div className="profile-info-grid">


                        <div className="profile-info-item">

                            <div className="profile-info-icon">

                                <User size={20} />

                            </div>


                            <div>

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {userName}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-item">

                            <div className="profile-info-icon">

                                <Mail size={20} />

                            </div>


                            <div>

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {user?.email || "-"}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-item">

                            <div className="profile-info-icon">

                                {userRole === "RESTAURANT_OWNER"
                                    ? <Store size={20} />
                                    : <ShieldCheck size={20} />
                                }

                            </div>


                            <div>

                                <span>
                                    Account Role
                                </span>

                                <strong>
                                    {getRoleLabel()}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-item">

                            <div className="profile-info-icon">

                                <Hash size={20} />

                            </div>


                            <div>

                                <span>
                                    Account ID
                                </span>

                                <strong>
                                    {user?.id || "-"}
                                </strong>

                            </div>

                        </div>

                    </div>


                </section>


                {/* =========================
                    ACCOUNT STATUS
                ========================= */}

                <section className="profile-status-card">

                    <div className="profile-status-icon">

                        <ShieldCheck size={25} />

                    </div>


                    <div>

                        <h3>
                            Your account is active
                        </h3>

                        <p>
                            You are currently signed in to QuickByte.
                        </p>

                    </div>


                    <span className="profile-status-badge">

                        Active

                    </span>

                </section>


            </div>

        </main>

    );

}