import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Ensure this file contains the URL for your backend API
import { Modal, Button, Form } from "react-bootstrap";

const PaidTicketsPage = ({ user }) => {
  const [paidTickets, setPaidTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ checkoutID: "", rating: "", comment: "" });
  const [selectedTicket, setSelectedTicket] = useState(null); // Track selected ticket for review
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  useEffect(() => {
    axios
      .get(`${config.userServiceUrl}/get-paid-tickets?user_id=${user.id || 0}`)
      .then((response) => {
        if (response.data.success) {
          setPaidTickets(response.data.data);
        } else {
          console.error("Failed to fetch paid tickets:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the paid tickets!", error);
      });

    axios
      .get(`${config.userServiceUrl}/get-reviews?user_id=${user.id || 0}`)
      .then((response) => {
        if (response.data.success) {
          setReviews(response.data.data);
        } else {
          console.error("Failed to fetch reviews:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  }, [user.id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      userID: user.id,
      checkoutID: selectedTicket.checkoutID,
      rating: parseInt(newReview.rating),
      comment: newReview.comment
    };

    axios
      .post(`${config.userServiceUrl}/add-review`, reviewData)
      .then((response) => {
        if (response.data.success) {
          alert("Review added successfully");
          setNewReview({ eventID: "", ticketID: "", rating: "", comment: "" });
          setSelectedTicket(null);
          setShowModal(false); // Hide modal
          // Fetch updated reviews
          axios
            .get(`${config.userServiceUrl}/get-reviews?user_id=${user.id || 0}`)
            .then((response) => {
              if (response.data.success) {
                setReviews(response.data.data);
              } else {
                console.error("Failed to fetch reviews:", response.data.error);
              }
            })
            .catch((error) => {
              console.error("There was an error fetching the reviews!", error);
            });
        } else {
          console.error("Failed to add review:", response.data.error);
          alert("Failed to add review");
        }
      })
      .catch((error) => {
        console.error("There was an error adding the review!", error);
        alert("Failed to add review");
      });
  };

  const openReviewModal = (ticket) => {
    console.log("Selected ticket:", ticket);
    setSelectedTicket(ticket);
    setNewReview({ checkoutID: ticket.checkoutID, rating: "", comment: "" });
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal
    setSelectedTicket(null);
  };

  return (
    <div className="container pt-5">
      <div className="row mt-2">
        <div className="col">
          <h1>Paid Tickets</h1>
        </div>
      </div>
      <div className="row mt-2">
        {paidTickets.length === 0 ? (
          <div className="col">
            <p>No paid tickets found.</p>
          </div>
        ) : (
          paidTickets.map((item) => (
            <div key={item.checkoutID} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">
                    <strong>End Date:</strong> {item.endDate}
                  </p>
                  <p className="card-text">
                    <strong>Deal Price:</strong> ${item.dealPrice.toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Discount:</strong> {item.discountPercent}%
                  </p>
                  <p className="card-text">
                    <strong>Paid Price:</strong> ${item.paidPrice.toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p className="card-text">
                    <strong>Checkout Date:</strong> {item.checkoutDate}
                  </p>
                  <Button variant="primary" onClick={() => openReviewModal(item)}>
                    Leave a Review
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={handleReviewChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                rows="3"
                value={newReview.comment}
                onChange={handleReviewChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="row mt-2">
        <div className="col">
          <h2>Your Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.reviewID} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {review.eventName} - {review.ticketType}
                    </h5>
                    <p className="card-text">Rating: {review.rating}</p>
                    <p className="card-text">Comment: {review.comment}</p>
                    <p className="card-text">Review Date: {review.reviewDate}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaidTicketsPage;
