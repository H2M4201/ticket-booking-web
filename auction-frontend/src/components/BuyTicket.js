import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Update this import based on your project structure

const BuyTicketPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch event data (use dummy data here)
    const fetchEvents = async () => {
      try {
        // Uncomment this if you have an API endpoint
        // const response = await axios.get(`${config.itemServiceUrl}/get-events`);
        // setEvents(response.data.data);

        // Dummy data
        const dummyEvents = [
          {
            eventID: 1,
            eventName: "Worlds 2024",
            eventDescription: "League of Legends finals",
            eventLocation: "Beijing",
            startDate: "2024-10-23",
            endDate: "2024-11-23",
            totalTicket: 400,
            availableTicket: 200
          },
          {
            eventID: 2,
            eventName: "World Cup 2022",
            eventDescription: "Football event",
            eventLocation: "Qatar",
            startDate: "2022-11-19",
            endDate: "2022-12-18",
            totalTicket: 10000,
            availableTicket: 8
          },
          {
            eventID: 3,
            eventName: "EPL 2025",
            eventDescription: "Football event",
            eventLocation: "UK",
            startDate: "2025-08-20",
            endDate: "2026-05-18",
            totalTicket: 100000,
            availableTicket: 100000
          }
        ];
        setEvents(dummyEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTicket = (eventID) => {
    // Implement the buy ticket logic here
    alert(`Buying ticket for event ID: ${eventID}`);
  };

  return (
    <div className="container pt-5">
      <div className="row mt-2">
        <div className="col">
          <h1>Buy Tickets</h1>
        </div>
      </div>
      <div className="row mt-2">
        {events.map((event) => (
          <div key={event.eventID} className="col-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{event.eventName}</h5>
                <p className="card-text">{event.eventDescription}</p>
                <p className="card-text">
                  <strong>Location:</strong> {event.eventLocation}
                </p>
                <p className="card-text">
                  <strong>Start Date:</strong> {event.startDate}
                </p>
                <p className="card-text">
                  <strong>End Date:</strong> {event.endDate}
                </p>
                <p className="card-text">
                  <strong>Total Tickets:</strong> {event.totalTicket}
                </p>
                <p className="card-text">
                  <strong>Available Tickets:</strong> {event.availableTicket}
                </p>
                <button className="btn btn-primary" onClick={() => handleBuyTicket(event.eventID)}>
                  Buy Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyTicketPage;
