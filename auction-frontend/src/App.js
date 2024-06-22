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

function App() {
  const [user, setUser] = useLocalStorage("user", null);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const handleLogin = (userData) => {
    setUser(userData.user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="ChangePassword" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/submit-listing" element={<SubmitListingForm />} />
        <Route path="/submit-event" element={<SubmitEventForm user={user} />} />
        <Route path="/buy-ticket" element={<BuyTicket user={user} />} />
        <Route path="/cart" element={<Cart user={user} />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
