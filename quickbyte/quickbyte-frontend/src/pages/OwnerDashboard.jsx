import { Link } from "react-router-dom";

export default function OwnerDashboard() {
    const sections = [
        {
            name: "Restaurant",
            path: "/owner/restaurant",
        },
        {
            name: "Categories",
            path: "/owner/categories",
        },
        {
            name: "Foods",
            path: "/",
        },
        {
            name: "Variants",
            path: "/",
        },
        {
            name: "Add-ons",
            path: "/",
        },
        {
            name: "Images",
            path: "/",
        },
        {
            name: "Timings",
            path: "/",
        },
    ];

    return (
        <main className="container">
            <h1>Restaurant Owner Dashboard</h1>

            <div className="grid">
                {sections.map((section) => (
                    <div className="card" key={section.name}>
                        <h2>{section.name}</h2>

                        <p>
                            Connect this screen to the existing{" "}
                            {section.name} API.
                        </p>

                        <Link
                            className="primary inline"
                            to={section.path}
                        >
                            Open
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}