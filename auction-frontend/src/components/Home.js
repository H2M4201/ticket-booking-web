import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import BuyTicketModal from "./BuyTicketModal";
import { useNavigate } from "react-router-dom";

function Home({ user }) {
  const [userInfo, setUserInfo] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryByLocation, setSearchQueryByLocation] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasResults, setHasResults] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  console.log({ userrr: user });

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

  useEffect(() => {
    // Fetch all events
    axios
      .get(`${config.itemServiceUrl}/get-events`)
      .then((response) => {
        setEvents(response.data.data);
        setFilteredResults(response.data.data); // Default to showing all events
        setHasResults(response.data.data.length > 0);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchByName = (e) => {
    e.preventDefault();
    if (!searchQueryByName) {
      setFilteredResults(events);
      setHasResults(events.length > 0);
    } else {
      const filtered = events.filter((event) => event.eventName.toLowerCase().includes(searchQueryByName.toLowerCase()));
      setFilteredResults(filtered);
      setHasResults(filtered.length > 0);
    }
  };

  const handleSearchByLocation = (e) => {
    e.preventDefault();
    if (!searchQueryByLocation) {
      setFilteredResults(events);
      setHasResults(events.length > 0);
    } else {
      const filtered = events.filter((event) => event.eventLocation.toLowerCase().includes(searchQueryByLocation.toLowerCase()));
      setFilteredResults(filtered);
      setHasResults(filtered.length > 0);
    }
  };

  const handleBuyTicket = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleModalSubmit = (data) => {
    axios
      .post(`${config.userServiceUrl}/add-checkout`, data)
      .then((response) => {
        console.log("Ticket purchased successfully", response);
        alert("Ticket purchased successfully!");
      })
      .catch((error) => {
        console.error("Error purchasing ticket", error);
        alert("Error purchasing ticket. Please try again.");
      });
  };


  return (
    <>
      <div className="container px-5 py-3 my-4">
        <h1 className="text-center">Active Events</h1>
        <form onSubmit={handleSearchByName}>
          <div className="row justify-content-center my-3">
            <div className="col-6">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  style={{marginRight: 10+"px"}}
                  value={searchQueryByName}
                  onChange={(e) => setSearchQueryByName(e.target.value)}
                  placeholder="Search events by name"
                />
                <button className="main-button" type="submit">
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
        <form onSubmit={handleSearchByLocation}>
          <div className="row justify-content-center my-3">
            <div className="col-6">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  style={{marginRight: 10+"px"}}
                  value={searchQueryByLocation}
                  onChange={(e) => setSearchQueryByLocation(e.target.value)}
                  placeholder="Search events by location"
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
            {filteredResults.map((event) => (
              <div className="col" key={event.eventID}>
                <div className="card h-100">
                  <div className="card-body">
                    <h4 className="card-title">{event.eventName}</h4>
                    <p className="card-subtitle mb-2 text-muted">{event.eventDescription || "No description"}</p>
                    <p className="card-subtitle mb-2 text-muted">Location: {event.eventLocation}</p>
                    <p className="card-subtitle mb-2 text-muted">Start Date: {formatDate(event.startDate)}</p>
                    <p className="card-subtitle mb-2 text-muted">End Date: {formatDate(event.endDate)}</p>
                  </div>
                  {userInfo.isGuest ? (
                    <div className="card-footer bg-transparent">
                      <button className="btn btn-primary" style={{marginRight: 20+"px"}} onClick={() => navigate(`/event/${event.eventID}`)}>
                        MoreInfo
                      </button>
                      <button className="btn btn-primary" onClick={() => handleBuyTicket(event)}>
                        Buy Ticket
                      </button>
                    </div>
                  ) : userInfo.isEnterprise ? (<>
                    <button className="btn btn-primary" style={{marginRight: 20+"px"}} onClick={() => navigate(`/event/${event.eventID}/edit`)}>
                      Edit Event
                    </button>
                  </>) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>No events found. Please try a different search.</p>
          </div>
        )}
      </div>
      {selectedEvent && (
        <BuyTicketModal
          show={showModal}
          onHide={handleModalClose}
          event={selectedEvent}
          onSubmit={handleModalSubmit}
          user={user}
        />
      )}
    </>
  );
}

export default Home;

