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
    <div className="w-full px-20 mx-auto bg-gray-50 dark:bg-gray-900 py-12">
      <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">
        My Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No cars in wishlist.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {wishlist.map((car) => (
            <div
              key={car.id}
              className="flex bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden"
            >
              <img src={car.image} alt={car.name} className="w-40 object-cover" />
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{car.name}</h3>
                  <p className="text-yellow-500 font-bold">{car.price}</p>
                </div>
                <div className="flex gap-3 mt-3">
                  <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                    Book Now
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                    Remove
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
