
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

