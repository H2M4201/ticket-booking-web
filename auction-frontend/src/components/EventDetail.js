import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import config from '../config';

function EventDetail() {
  const { eventID } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${config.itemServiceUrl}/event/${eventID}`);
        setEvent(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventID]);


  return (
    <div className="container">
      <h1>{event.eventName}</h1>
      <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0rKM009sT3Qh-la5UpwgEv2F9iZ0fR_aVA&s"} alt={event.eventName} />
      <p>{event.eventDescription}</p>
      <p>Location: {event.eventLocation}</p>
      <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
    </div>
  );
}

export default EventDetail;
