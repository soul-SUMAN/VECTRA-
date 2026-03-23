import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/admin">VECTRA Admin</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/admin" className="hover:text-yellow-500">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/cars" className="hover:text-yellow-500">Manage Cars</Link>
          </li>
          <li>
            <Link to="/admin/bookings" className="hover:text-yellow-500">Bookings</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-yellow-500">Back to Site</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;