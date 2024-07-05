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
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, []);
  console.log(event);

  if (!event) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container px-5 py-3 my-4 col-6" style={{border: "2px black solid", backgroundColor: "#f9ece6", padding: "30px", minHeight: "80vh"}}>
      <div style={{backgroundColor: "f9ece6"}}>
        {/* <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0rKM009sT3Qh-la5UpwgEv2F9iZ0fR_aVA&s"} alt={event.eventName} /> */}
        <h1>{event['eventName']}</h1>
        <p>{event.eventDescription}</p>
        <div style={{border: "1px solid rgba(0, 0, 0, 0.1)", marginBottom: "15px"}}></div>
        <p>Location: {event.eventLocation}</p>
        <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
        <p>Open for ticket: {new Date(event.openForTicket).toLocaleDateString()}</p>
        <p>Close for ticket: {new Date(event.closeForTicket).toLocaleDateString()}</p>
        {event.avgRating?(
          <p>Rating: {event.avgRating}</p>
        ):(<div></div>)}
      </div>
      <div style={{border: "1px solid rgba(0, 0, 0, 0.1)", marginBottom: "15px"}}></div>
      <h2>Tickets</h2>
      {
        event.tickets.map((ticket) => (
          <div className='card col-12' style={{padding: "5px 10px"}}>
            <div className='card-body'>
              <p>Type: {ticket.ticketType}</p>
              <p>Price: {ticket.price}</p>
              <p>Ticket total: {ticket.total}</p>
              <p>Ticket sold: {ticket.sold}</p>
              {
                ticket.discounts.map((discount) => (
                <>
                  <div style={{border: "1px solid rgba(0, 0, 0, 0.2)", marginBottom: "15px"}}></div>
                  <p><b>{discount.discountName}</b> - {discount.discountDescription}</p>
                  <p>Start Date: {new Date(discount.discountStartDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(discount.discountEndDate).toLocaleDateString()}</p>
                </>
              ))
              }
            </div>
          </div>
        ))
      }
      <div style={{border: "1px solid rgba(0, 0, 0, 0.1)", margin: "35px 0px 15px"}}></div>
      <h2>Reviews</h2>
      {
        event.reviews.map((review) => (
          <div style={{width: "100%", margin: "auto", border: "1px solid rgba(0,0,0,0.5)", padding: "8px 15px", marginBottom: "10px", borderRadius: "15px"}}>
            <div className="review">
              <div className="rating">Rating: {review.rating}</div>
              <div className="comment">Comment: {review.comment}</div>
              <div className="date">Date: {review.reviewDate}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default EventDetail;