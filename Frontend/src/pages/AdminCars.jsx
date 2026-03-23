import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const AdminCars = () => {
  const [cars, setCars] = useState([
    { id: 1, name: "BMW M3", price: "₹4500/day", image: "/cars/bmwm3.png", type: "Sedan" },
    { id: 2, name: "Audi A6", price: "₹4000/day", image: "/cars/audia6.png", type: "Luxury" },
    { id: 3, name: "Hyundai Creta", price: "₹2500/day", image: "/cars/creta.png", type: "SUV" },
    { id: 4, name: "Maruti Swift", price: "₹1500/day", image: "/cars/swift.png", type: "Hatchback" },
  ]);

  const [newCar, setNewCar] = useState({ name: '', price: '', image: '', type: '' });

  const handleAddCar = () => {
    if (newCar.name && newCar.price && newCar.image && newCar.type) {
      setCars([...cars, { ...newCar, id: cars.length + 1 }]);
      setNewCar({ name: '', price: '', image: '', type: '' });
    }
  };

  const handleDeleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Cars</h1>
        
        {/* Add New Car Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Car Name"
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Price (e.g., ₹4500/day)"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image Path"
              value={newCar.image}
              onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Type"
              value={newCar.type}
              onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddCar}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Car
          </button>
        </div>

        {/* Cars List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={car.image} alt={car.name} className="w-full h-32 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold">{car.name}</h3>
              <p className="text-gray-600">{car.type}</p>
              <p className="text-lg font-bold text-yellow-500">{car.price}</p>
              <button
                onClick={() => handleDeleteCar(car.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCars;