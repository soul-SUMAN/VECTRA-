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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-center text-slate-300">No bookings found.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-lg md:flex"
              >
                <img src={booking.image} alt={booking.car} className="h-56 w-full object-cover md:h-auto md:w-56" />
                <div className="flex w-full flex-col justify-between p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-semibold text-white">{booking.car}</h3>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Pickup: {booking.pickup} | Drop-off: {booking.dropoff}
                  </p>
                  <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                    <button className="rounded-3xl bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600">
                      View Details
                    </button>
                    <button className="rounded-3xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
