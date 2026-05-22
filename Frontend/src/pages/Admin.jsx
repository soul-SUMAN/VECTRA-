import React from 'react';
import AdminNavbar from '../components/AdminNavbar';

const Admin = () => {
  return (
    <>
    <div>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        <div className="max-w-screen-xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Admin Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <h2 className="text-xl text-white font-semibold mb-4">Total Cars</h2>
              <p className="text-2xl font-bold text-yellow-500">10</p>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <h2 className="text-xl text-white font-semibold mb-4">Total Bookings</h2>
              <p className="text-2xl font-bold text-green-500">25</p>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <h2 className="text-xl text-white font-semibold mb-4">Total Users</h2>
              <p className="text-2xl font-bold text-purple-500">50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Admin;