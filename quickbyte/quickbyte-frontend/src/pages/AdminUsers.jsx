import {
    useEffect,
    useState
} from "react";

import {
    Users,
    Search,
    User,
    ShieldCheck,
    Store,
    Mail,
    Phone,
    RefreshCw
} from "lucide-react";

import {
    getAllUsers
} from "../api/userApi";


export default function AdminUsers() {


    /*
    ================================
    STATES
    ================================
    */

    const [
        users,
        setUsers
    ] = useState([]);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    /*
    ================================
    LOAD ALL USERS
    ================================
    */

    const loadUsers = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getAllUsers();


            setUsers(
                response.data
            );


        } catch (error) {

            console.error(
                "Failed to load users:",
                error
            );


            setError(

                error?.response?.data?.message ||

                "Failed to load users."

            );

        } finally {

            setLoading(false);

        }

    };


    /*
    ================================
    INITIAL LOAD
    ================================
    */

    useEffect(() => {

        loadUsers();

    }, []);



    /*
    ================================
    SEARCH USERS
    ================================
    */

    const filteredUsers =

        users.filter(
            (user) => {

                const searchValue =
                    search
                        .toLowerCase()
                        .trim();


                return (

                    user.fullName
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        )

                    ||

                    user.email
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        )

                    ||

                    user.role
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        )

                );

            }
        );



    /*
    ================================
    ROLE ICON
    ================================
    */

    const getRoleIcon = (
        role
    ) => {

        if (role === "ADMIN") {

            return (
                <ShieldCheck
                    size={18}
                />
            );

        }


        if (
            role ===
            "RESTAURANT_OWNER"
        ) {

            return (
                <Store
                    size={18}
                />
            );

        }


        return (
            <User
                size={18}
            />
        );

    };



    /*
    ================================
    FORMAT ROLE
    ================================
    */

    const formatRole = (
        role
    ) => {

        if (!role) {

            return "User";

        }


        return role

            .toLowerCase()

            .split("_")

            .map(
                (word) =>

                    word.charAt(0)
                        .toUpperCase()

                    +

                    word.slice(1)
            )

            .join(" ");

    };



    /*
    ================================
    LOADING
    ================================
    */

    if (loading) {

        return (

            <main
                className="
                    owner-dashboard-page
                "
            >

                <div
                    className="
                        owner-dashboard-container
                    "
                >

                    <div
                        className="
                            admin-empty-state
                        "
                    >

                        <Users
                            size={45}
                        />

                        <h3>

                            Loading users...

                        </h3>

                        <p>

                            Please wait while
                            user information loads.

                        </p>

                    </div>

                </div>

            </main>

        );

    }



    /*
    ================================
    UI
    ================================
    */

    return (

        <main
            className="
                owner-dashboard-page
            "
        >

            <div
                className="
                    owner-dashboard-container
                "
            >


                {/* =========================
                    HEADER
                ========================= */}

                <section
                    className="
                        owner-hero
                    "
                >

                    <div
                        className="
                            owner-hero-content
                        "
                    >

                        <div
                            className="
                                owner-dashboard-badge
                            "
                        >

                            <Users
                                size={16}
                            />

                            USER MANAGEMENT

                        </div>


                        <h1>

                            Manage

                            <span>
                                {" "}Users
                            </span>

                        </h1>


                        <p>

                            View and manage customers,
                            restaurant owners and
                            administrators on QuickByte.

                        </p>

                    </div>


                    <div
                        className="
                            owner-hero-icon
                        "
                    >

                        <Users
                            size={42}
                        />

                    </div>

                </section>



                {/* =========================
                    USERS SECTION
                ========================= */}

                <section
                    className="
                        admin-users-section
                    "
                >


                    <div
                        className="
                            owner-section-heading
                        "
                    >

                        <div>

                            <span>

                                PLATFORM USERS

                            </span>


                            <h2>

                                All Users

                            </h2>


                            <p>

                                Search and monitor users
                                across the QuickByte platform.

                            </p>

                        </div>


                        {/* REFRESH BUTTON */}

                        <button

                            type="button"

                            className="
                                delivery-refresh-button
                            "

                            onClick={
                                loadUsers
                            }

                        >

                            <RefreshCw
                                size={16}
                            />

                            Refresh

                        </button>

                    </div>



                    {/* =========================
                        ERROR
                    ========================= */}

                    {

                        error && (

                            <div
                                className="
                                    admin-error
                                "
                            >

                                {error}

                            </div>

                        )

                    }



                    {/* =========================
                        SEARCH
                    ========================= */}

                    <div
                        className="
                            admin-users-search
                        "
                    >

                        <Search
                            size={20}
                        />

                        <input

                            type="text"

                            placeholder={
                                "Search by name, email or role..."
                            }

                            value={
                                search
                            }

                            onChange={
                                (event) =>

                                    setSearch(
                                        event.target.value
                                    )
                            }

                        />

                    </div>



                    {/* =========================
                        USERS COUNT
                    ========================= */}

                    <div
                        className="
                            admin-users-count
                        "
                    >

                        {

                            filteredUsers.length

                        }

                        {" "}

                        {

                            filteredUsers.length === 1

                                ?

                                "User Found"

                                :

                                "Users Found"

                        }

                    </div>



                    {/* =========================
                        USERS LIST
                    ========================= */}

                    {

                        filteredUsers.length === 0

                            ?

                            (

                                <div
                                    className="
                                        admin-empty-state
                                    "
                                >

                                    <Users
                                        size={45}
                                    />

                                    <h3>

                                        No users found

                                    </h3>

                                    <p>

                                        {

                                            search

                                                ?

                                                "Try searching with a different name, email or role."

                                                :

                                                "No users are currently registered on QuickByte."

                                        }

                                    </p>

                                </div>

                            )

                            :

                            (

                                <div
                                    className="
                                        admin-users-grid
                                    "
                                >

                                    {

                                        filteredUsers.map(
                                            (
                                                user
                                            ) => (

                                                <div

                                                    key={
                                                        user.id
                                                    }

                                                    className="
                                                        admin-user-card
                                                    "

                                                >


                                                    {/* USER HEADER */}

                                                    <div
                                                        className="
                                                            admin-user-card-header
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                admin-user-avatar
                                                            "
                                                        >

                                                            <User
                                                                size={24}
                                                            />

                                                        </div>


                                                        <div
                                                            className="
                                                                admin-user-role
                                                            "
                                                        >

                                                            {

                                                                getRoleIcon(
                                                                    user.role
                                                                )

                                                            }


                                                            <span>

                                                                {

                                                                    formatRole(
                                                                        user.role
                                                                    )

                                                                }

                                                            </span>

                                                        </div>

                                                    </div>



                                                    {/* USER DETAILS */}

                                                    <div
                                                        className="
                                                            admin-user-info
                                                        "
                                                    >

                                                        <h3>

                                                            {

                                                                user.fullName

                                                            }

                                                        </h3>


                                                        <div
                                                            className="
                                                                admin-user-detail
                                                            "
                                                        >

                                                            <Mail
                                                                size={17}
                                                            />

                                                            <span>

                                                                {

                                                                    user.email

                                                                }

                                                            </span>

                                                        </div>


                                                        <div
                                                            className="
                                                                admin-user-detail
                                                            "
                                                        >

                                                            <Phone
                                                                size={17}
                                                            />

                                                            <span>

                                                                {

                                                                    user.phoneNumber

                                                                }

                                                            </span>

                                                        </div>

                                                    </div>



                                                    {/* USER FOOTER */}

                                                    <div
                                                        className="
                                                            admin-user-footer
                                                        "
                                                    >

                                                        <span>

                                                            User ID

                                                        </span>


                                                        <strong>

                                                            #

                                                            {

                                                                user.id

                                                            }

                                                        </strong>

                                                    </div>

                                                </div>

                                            )

                                        )

                                    }

                                </div>

                            )

                    }


                </section>


            </div>

        </main>

    );

}