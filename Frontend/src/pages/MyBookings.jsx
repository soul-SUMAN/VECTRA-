import React from "react";

const bookings = [
  {
    id: 1,
    car: "BMW M3",
    image: "/cars/bmwm3.png",
    pickup: "2025-09-12",
    dropoff: "2025-09-15",
    status: "Confirmed",
  },
  {
    id: 2,
    car: "Hyundai Creta",
    image: "/cars/creta.png",
    pickup: "2025-09-20",
    dropoff: "2025-09-22",
    status: "Pending",
  },
];

export default function Bookings() {
  return (
    <div className="w-full px-24 bg-gray-50 dark:bg-gray-900 mx-auto py-12">
      <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">
        My Bookings
      </h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden"
            >
              <img src={booking.image} alt={booking.car} className="w-40 object-cover" />
              <div className="p-5 flex flex-col justify-between w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{booking.car}</h3>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-300">
                  Pickup: {booking.pickup} | Drop-off: {booking.dropoff}
                </p>
                <div className="flex gap-3 mt-3">
                  <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
