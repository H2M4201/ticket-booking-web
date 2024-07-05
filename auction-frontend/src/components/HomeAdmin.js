import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import BuyTicketModal from "./BuyTicketModal";
import { useNavigate, useParams } from "react-router-dom";

function HomeAdmin({ user }) {
  const { userID } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryByLocation, setSearchQueryByLocation] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasResults, setHasResults] = useState(true);

  const navigate = useNavigate();

  console.log({ userrr: user });

  // get user info, in this case, admin's account profile
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

  // fetch all users
  useEffect(() => {
    axios
      .get(`${config.userServiceUrl}/admin`)
      .then((response) => {
        setUsers(response.data.data);
        setFilteredResults(response.data.data); // Default to showing all events
        setHasResults(response.data.data.length > 0);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchByName = (e) => {
    e.preventDefault();
    if (!searchQueryByName) {
      setFilteredResults(users);
      setHasResults(users.length > 0);
    } else {
      const filtered = users.filter((users) => users.userName.toLowerCase().includes(searchQueryByName.toLowerCase()));
      setFilteredResults(filtered);
      setHasResults(filtered.length > 0);
    }
  };

  const handleDelete = async (userID) => {
    console.log('abc', userID);
    try {
      const response = await axios.delete(`${config.userServiceUrl}/admin/delete/${userID}`);
      if (response.status === 200) {
        setFilteredResults(filteredResults.filter(user => user.userID !== userID));
      } else {
        console.error('Failed to delete user:', response);
      }
    } catch (error) {
      console.error('There was an error deleting the user:', error);
    }
  };



  return (
    <>
      <div className="container px-5 py-3 my-4">
        <h1 className="text-center">Active Users</h1>
        <form onSubmit={handleSearchByName}>
          <div className="row justify-content-center my-3">
            <div className="col-6">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  value={searchQueryByName}
                  onChange={(e) => setSearchQueryByName(e.target.value)}
                  placeholder="Search users by name"
                />
                <button className="main-button" type="submit">
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
        {hasResults ? (
          <div className="row row-cols-1 row-cols-md-2 g-4 px-3">
            {filteredResults.map((users) => (
              <div className="col" key={users.userID}>
                <div className="card h-100">
                  <div className="card-body">
                    <h4 className="card-title">{users.userName}</h4>
                    <p className="card-subtitle mb-2 text-muted">First Name: {users.firstName}</p>
                    <p className="card-subtitle mb-2 text-muted">Last Name: {users.lastName}</p>
                    <p className="card-subtitle mb-2 text-muted">Email: {users.email}</p>
                    <p className="card-subtitle mb-2 text-muted">Phone Number: {users.phone || "No phone number"}</p>
                    <p className="card-subtitle mb-2 text-muted">Date Joined: {formatDate(users.dateJoined)}</p>
                    <p className="card-subtitle mb-2 text-muted">Account Type: {users.type}</p>
                    <button className="btn btn-danger mt-3" onClick={() => handleDelete(users.userID)}>Delete Account</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>No user found. Please try a different search.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default HomeAdmin;

