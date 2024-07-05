import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./static/css/style.css";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import useLocalStorage from "./hooks/useLocalStorage";
import SubmitEventForm from "./components/SubmitEvent";
import Cart from "./components/Cart";
import SubmitDiscountForm from "./components/SubmitDiscount";
import ResetPassword from "./components/ResetPassword";
import PaidTicketsPage from "./components/PaidTicket";
import DiscountList from "./components/DiscountList";
import EventDetail from "./components/EventDetail";
import DiscountDetail from "./components/DiscountDetail";
import HomeAdmin from "./components/HomeAdmin";

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
    <div style={{backgroundColor: "#f3f3f5", minHeight: "100vh"}}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/admin" element={<HomeAdmin user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="ChangePassword" element={<ChangePassword user={user} />} />
          <Route path="ResetPassword" element={<ResetPassword onReset={handleReset} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/submit-event" element={<SubmitEventForm user={user} />} />
          <Route path="/submit-discount" element={<SubmitDiscountForm user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path= "/event/:eventID" element={<EventDetail />} />
          <Route path= "/discount/:discountID" element={<DiscountDetail />} />
          <Route path="/paid-ticket" element={<PaidTicketsPage user={user} />} />
          <Route path="/discount-list" element={<DiscountList />}/>
          {/* other routes */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
