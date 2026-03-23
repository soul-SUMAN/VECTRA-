
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Cars from "./pages/Cars.jsx";
import Bookings from "./pages/MyBookings.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Admin from "./pages/Admin.jsx";
import AdminCars from "./pages/AdminCars.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './authentication/login.jsx'

function App() {
  return (
  <>
   <Router>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/cars" element={<AdminCars />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />

      </Routes>
      <Footer />
    </Router>
    
  </>
  )
}

export default App
