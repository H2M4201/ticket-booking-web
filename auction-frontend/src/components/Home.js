import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

function Listings() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasResults, setHasResults] = useState(true);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredResults(events);
      setHasResults(events.length > 0);
    } else {
      const filtered = events.filter((event) => event.eventName.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredResults(filtered);
      setHasResults(filtered.length > 0);
    }
  };

  return (
    <>
      <div className="container px-5 py-3 my-4">
        <h1 className="text-center">Active Events</h1>
        <form onSubmit={handleSearch}>
          <div className="row justify-content-center my-3">
            <div className="col-6">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by name"
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
                    <h5 className="mt-3">Tickets</h5>
                    {Object.values(event.tickets).map((ticket) => (
                      <div key={ticket.ticketID} className="mb-3">
                        <p className="card-subtitle mb-2 text-muted">Type: {ticket.ticketType}</p>
                        <p className="card-subtitle mb-2 text-muted">Price: ${ticket.price}</p>
                        <p className="card-subtitle mb-2 text-muted">
                          Total: {ticket.total}, Sold: {ticket.sold}
                        </p>
                        <h6>Discounts</h6>
                        {ticket.discounts.length > 0 ? (
                          ticket.discounts.map((discount) => (
                            <div key={discount.discountID}>
                              <p className="card-subtitle mb-2 text-muted">Name: {discount.discountName}</p>
                              <p className="card-subtitle mb-2 text-muted">Percent: {discount.discountPercent}%</p>
                              <p className="card-subtitle mb-2 text-muted">
                                Description: {discount.discountDescription}
                              </p>
                              <p className="card-subtitle mb-2 text-muted">
                                Start Date: {formatDate(discount.discountStartDate)}
                              </p>
                              <p className="card-subtitle mb-2 text-muted">
                                End Date: {formatDate(discount.discountEndDate)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="card-subtitle mb-2 text-muted">No discounts available</p>
                        )}
                      </div>
                    ))}
                  </div>
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
    </>
  );
}

export default Listings;
