import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import BuyTicketModal from "./BuyTicketModal";
import { useNavigate, useParams } from "react-router-dom";

function EventManagement({ user }) {
  const [events, setEvents] = useState([]);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasResults, setHasResults] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventInfo, setEventInfo] = useState({
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

  const { userID } = useParams;

  const navigate = useNavigate();

  console.log({ userrr: user });
  console.log(userID);

  useEffect(() => {
    // Fetch all events
    axios
      .get(`${config.itemServiceUrl}/editEvent/${userID}`)
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
                      <button className="btn btn-primary" onClick={() => navigate(`/event/${event.eventID}`)}>
                        MoreInfo
                      </button>
                      <button className="btn btn-primary" onClick={() => handleBuyTicket(event)}>
                        Buy Ticket
                      </button>
                    </div>
                  ) : null}
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

export default EventManagement;


// {Object.values(event.tickets).map((ticket) => (
//   <div key={ticket.ticketID} className="mb-3">
//     <p className="card-subtitle mb-2 text-muted">Type: {ticket.ticketType}</p>
//     <p className="card-subtitle mb-2 text-muted">Price: ${ticket.price}</p>
//     <p className="card-subtitle mb-2 text-muted">
//       Total: {ticket.total}, Sold: {ticket.sold}
//     </p>
//     <h6>Discounts</h6>
//     {ticket.discounts.length > 0 ? (
//       ticket.discounts.map((discount) => (
//         <div key={discount.discountID}>
//           <p className="card-subtitle mb-2 text-muted">Name: {discount.discountName}</p>
//           <p className="card-subtitle mb-2 text-muted">Percent: {discount.discountPercent}%</p>
//           <p className="card-subtitle mb-2 text-muted">
//             Description: {discount.discountDescription}
//           </p>
//           <p className="card-subtitle mb-2 text-muted">
//             Start Date: {formatDate(discount.discountStartDate)}
//           </p>
//           <p className="card-subtitle mb-2 text-muted">
//             End Date: {formatDate(discount.discountEndDate)}
//           </p>
//         </div>
//       ))
//     ) : (
//       <p className="card-subtitle mb-2 text-muted">No discounts available</p>
//     )}
//   </div>
// ))}

// <h6>Average Rating</h6>
// <p className="card-subtitle mb-2 text-muted">
//   {event.avgRating ? `${event.avgRating.toFixed(1)} stars` : "No reviews yet"}
// </p>
// <h6>Latest Reviews</h6>
// {event.reviews && event.reviews.length > 0 ? (
//   event.reviews.map((review, index) => (
//     <div key={index}>
//       <p className="card-subtitle mb-2 text-muted">Rating: {review.rating}</p>
//       <p className="card-subtitle mb-2 text-muted">Comment: {review.comment}</p>
//       <p className="card-subtitle mb-2 text-muted">Date: {formatDate(review.reviewDate)}</p>
//     </div>
//   ))
// ) : (
//   <p className="card-subtitle mb-2 text-muted">No reviews available</p>
// )}