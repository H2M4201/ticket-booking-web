import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./static/css/style.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Listings from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import SubmitListingForm from "./components/SubmitListing";
import useLocalStorage from "./hooks/useLocalStorage";
import SubmitEventForm from "./components/SubmitEvent";
import BuyTicket from "./components/BuyTicket";
import Cart from "./components/Cart";
import SubmitDiscountForm from "./components/SubmitDiscount";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useLocalStorage("user", null);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const handleLogin = (userData) => {
    setUser(userData.user);
  };
  const handleReset = (userData) => {
    setUser(userData.user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Listings user={user}/>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="ChangePassword" element={<ChangePassword user={user} />} />
        <Route path="ResetPassword" element={<ResetPassword onReset={handleReset} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/submit-listing" element={<SubmitListingForm />} />
        <Route path="/submit-event" element={<SubmitEventForm user={user} />} />
        <Route path="/submit-discount" element={<SubmitDiscountForm user={user} />} />
        <Route path="/buy-ticket" element={<BuyTicket user={user} />} />
        <Route path="/cart" element={<Cart user={user} />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
