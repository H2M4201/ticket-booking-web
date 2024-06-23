import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

function CustomNavbar({ isLoggedIn, user, onLogout }) {
  const [userInfo, setUserInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;
    axios
      .get(`${config.userServiceUrl}/user/${user.id}/profile`)
      .then((response) => {
        if (response.data.success) {
          setUserInfo(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, [user]);

  if (!userInfo) {
    return <div>Loading...</div>;
  } else {
    console.log(userInfo);
  }

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={process.env.PUBLIC_URL + "/static/img/logo.png"} alt="Logo" className="logo-img" />
            <span className="auction-text">Ticket Booking System</span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/submit-event">
              <Nav.Link>Discounts</Nav.Link>
            </LinkContainer>
            {isLoggedIn ? (
              <NavDropdown title={user.username} id="basic-nav-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                {userInfo.isGuest ? (
                  <>
                    <LinkContainer to="/buy-ticket">
                      <NavDropdown.Item>Buy Ticket</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/cart">
                      <NavDropdown.Item>Cart</NavDropdown.Item>
                    </LinkContainer>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/submit-event">
                      <NavDropdown.Item>Add Event</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/register">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Log In</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
