import React from "react";

const cars = [
  {
    id: 1,
    name: "BMW M3",
    price: "₹4500/day",
    image: "/cars/bmwm3.png",
    type: "Sedan",
  },
  {
    id: 2,
    name: "Audi A6",
    price: "₹4000/day",
    image: "/cars/audia6.png",
    type: "Luxury",
  },
  {
    id: 3,
    name: "Hyundai Creta",
    price: "₹2500/day",
    image: "/cars/creta.png",
    type: "SUV",
  },
  {
    id: 4,
    name: "Maruti Swift",
    price: "₹1500/day",
    image: "/cars/swift.png",
    type: "Hatchback",
  },
];

export default function Cars() {
  return (
    <div className=" w-full mx-auto px-16 py-12 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">
        Available Cars
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden hover:scale-105 transition transform"
          >
            <img src={car.image} alt={car.name} className="w-full h-52 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{car.name}</h3>
              <p className="text-gray-500 dark:text-gray-300">{car.type}</p>
              <p className="mt-2 text-lg font-bold text-yellow-500">{car.price}</p>
              <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg">
                Book Now
              </button>
              <button className="mt-2 w-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg">
                Add to Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
