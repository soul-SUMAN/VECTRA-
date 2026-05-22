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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-orange-500 mb-10">Available Cars</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-lg transition duration-200 hover:scale-105"
            >
              <img src={car.image} alt={car.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{car.name}</h3>
                <p className="text-slate-300">{car.type}</p>
                <p className="mt-2 text-lg font-bold text-yellow-500">{car.price}</p>
                <button className="mt-4 w-full rounded-3xl bg-yellow-500 py-2 px-4 text-white transition hover:bg-yellow-600">
                  Book Now
                </button>
                <button className="mt-2 w-full rounded-3xl bg-slate-700 py-2 px-4 text-white transition hover:bg-slate-600">
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
