export default function RestaurantSelector({
                                               restaurants,
                                               selectedRestaurantId,
                                               onChange,
                                           }) {
    return (
        <div className="card">

            <h2>
                Select Restaurant
            </h2>

            {restaurants.length === 0 ? (

                <p>
                    No restaurants found.
                </p>

            ) : (

                <select
                    value={selectedRestaurantId || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                >

                    <option value="">
                        Select a restaurant
                    </option>

                    {restaurants.map(
                        (restaurant) => (

                            <option
                                key={restaurant.id}
                                value={restaurant.id}
                            >

                                {restaurant.name}

                            </option>

                        )
                    )}

                </select>

            )}

        </div>
    );
}