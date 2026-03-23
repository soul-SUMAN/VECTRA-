import React from 'react';
import AdminNavbar from '../components/AdminNavbar';

const Admin = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Cars</h2>
            <p className="text-2xl font-bold text-blue-600">10</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Bookings</h2>
            <p className="text-2xl font-bold text-green-600">25</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Users</h2>
            <p className="text-2xl font-bold text-purple-600">50</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;