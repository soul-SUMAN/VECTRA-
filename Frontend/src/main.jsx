import React ,{ StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import App from './App.jsx';

import Home from './pages/Home.jsx';
import Cars from "./pages/Cars.jsx";
import Bookings from "./pages/MyBookings.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Admin from "./pages/Admin.jsx";
import AdminCars from "./pages/AdminCars.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import Login from "./authentication/login.jsx";

const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    {/*main user routers*/}
        <Route path="" element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        
        {/* Grouped Admin routes */}
        <Route path="admin">
          <Route path="" element={<Admin />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
