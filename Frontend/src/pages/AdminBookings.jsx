import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([
    { id: 1, user: 'John Doe', car: 'BMW M3', dates: '2023-10-01 to 2023-10-05', status: 'Confirmed' },
    { id: 2, user: 'Jane Smith', car: 'Audi A6', dates: '2023-10-10 to 2023-10-12', status: 'Pending' },
    { id: 3, user: 'Bob Johnson', car: 'Hyundai Creta', dates: '2023-10-15 to 2023-10-20', status: 'Confirmed' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  return (
    <div>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        <div className="max-w-screen-xl mx-auto space-y-8">
          <h1 className="text-3xl text-orange-500 font-bold">Manage Bookings</h1>
          <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800 shadow-lg">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="last:border-b-0">
                    <td className="p-4 whitespace-nowrap">{booking.user}</td>
                    <td className="p-4 whitespace-nowrap">{booking.car}</td>
                    <td className="p-4 whitespace-nowrap">{booking.dates}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;