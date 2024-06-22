import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

function Profile({ user }) {
  const [userInfo, setUserInfo] = useState({
    bankAccount: "",
    dateJoined: "",
    email: "",
    firstName: "",
    isAdmin: 0,
    isEnterprise: 0,
    isGuest: 0,
    lastName: "",
    password: "",
    phoneNumber: "",
    userID: 0,
    userName: ""
  });
  const [formData, setFormData] = useState({
    bankAccount: "",
    dateJoined: "",
    email: "",
    firstName: "",
    isAdmin: 0,
    isEnterprise: 0,
    isGuest: 0,
    lastName: "",
    password: "",
    phoneNumber: "",
    userID: 0,
    userName: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${config.userServiceUrl}/user/${user.id}/profile`, {
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      if (response.data.success) {
        alert("Profile updated");
        navigate("/profile");
      }
    } catch (error) {
      alert("An error occurred during profile update");
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;
    axios
      .get(`${config.userServiceUrl}/user/${user.id}/profile`)
      .then((response) => {
        if (response.data.success) {
          setUserInfo(response.data.data);
          setFormData(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, [user, user.id]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container pt-5">
      <h1>{formData.firstName + " " + formData.lastName}'s Profile</h1>

      <form onSubmit={handleSubmit}>
        {/* Basic info of the user */}
        <div className="mt-4">
          <h4 style={{ color: "maroon" }}>Profile Details</h4>
          <div className="row">
            <div className="col-4">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="col-4">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" name="email" value={formData.email} disabled />
            </div>
            <div className="col-4">
              <label htmlFor="userName" className="form-label">
                Username
              </label>
              <input type="text" className="form-control" name="userName" value={formData.userName} disabled />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-4">
              <label htmlFor="type" className="form-label">
                Account Type
              </label>
              <input
                type="type"
                className="form-control"
                name="type"
                value={formData.isAdmin ? "Admin" : formData.isGuest ? "Guest" : "Enterprise"}
                disabled
              />
            </div>
            <div className="col-4">
              <label htmlFor="type" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-4">
              <label>Date Joined</label>
              <input
                type="text"
                className="form-control"
                value={new Date(formData.dateJoined).toLocaleDateString()}
                disabled
              />
            </div>
          </div>

          <div className="row my-4">
            <div className="col-4">
              <button className="btn btn-danger" type="submit">
                Update Profile
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/ChangePassword")}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
