import React from "react";

const wishlist = [
  {
    id: 1,
    name: "Tesla Model 3",
    price: "₹5000/day",
    image: "/cars/tesla.png",
  },
  {
    id: 2,
    name: "Mercedes C-Class",
    price: "₹4800/day",
    image: "/cars/cclass.png",
  },
];

export default function Wishlist() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-center text-slate-300">No cars in wishlist.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {wishlist.map((car) => (
              <div key={car.id} className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img src={car.image} alt={car.name} className="h-56 w-full object-cover sm:h-auto sm:w-40" />
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{car.name}</h3>
                      <p className="mt-2 text-yellow-500 font-bold">{car.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button className="rounded-3xl bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600">
                        Book Now
                      </button>
                      <button className="rounded-3xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                        Remove
                      </button>
                    </div>
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
