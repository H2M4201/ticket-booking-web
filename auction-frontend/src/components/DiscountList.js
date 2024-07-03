import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from "../config";

const DiscountList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.itemServiceUrl}/discount-list`);
        setEvents(response.data.data);
      } catch (error) {
        console.error('Cannot get discount:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="row">
      {events.map((event) => (
        <div key={event.discountID} className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card h-100">
            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0rKM009sT3Qh-la5UpwgEv2F9iZ0fR_aVA&s"} className="card-img-top" alt={event.eventName} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{event.eventName}</h5>
              <p className="card-text">{event.eventDescription}</p>
              <p className="card-text text-muted">
                From: {event.discountStartDate}
              </p>
              <p className="card-text text-muted">
                To: {event.discountEndDate}
              </p>
              <p className="card-text text-danger">
                Discount: {event.discountPercent}%
              </p>
              <btn href="#" className="btn btn-primary mt-auto" onClick={() => navigate(`/discount/${event.discountID}`)}>
                More Info
              </btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscountList;
