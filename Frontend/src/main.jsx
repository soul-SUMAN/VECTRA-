

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Cars from './pages/Cars.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Admin from './pages/Admin.jsx';
import AdminCars from './pages/AdminCars.jsx';
import AdminBookings from './pages/AdminBookings.jsx';
import Login from './authentication/login.jsx';
import UserProfile from './pages/UserProfile.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* Public routes */}
      <Route path="" element={<Home />} />
      <Route path="cars" element={<Cars />} />
      <Route path="login" element={<Login />} />

      {/* Authenticated user routes */}
      <Route path="bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="profile"  element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

      {/* Admin-only routes */}
      <Route path="admin">
        <Route path=""        element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="cars"    element={<ProtectedRoute role="admin"><AdminCars /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
      </Route>

    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
