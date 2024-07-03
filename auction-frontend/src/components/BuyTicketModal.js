import React, { useState,useEffect } from "react";
import axios from "axios";
import config from "../config";
import { Modal, Button, Form } from "react-bootstrap";

const BuyTicketModal = ({ show, onHide, event, onSubmit, user }) => {
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  console.log({ "user:": user });

  const handleTicketChange = (e) => {
    setSelectedTicket(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setSelectedDiscount(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      eventID: event.eventID,
      ticketID: selectedTicket,
      quantity: quantity,
      discountID: selectedDiscount,
      userID: user.id
    });
    onHide();
  };


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Buy Ticket for {event.eventName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="ticketType">
            <Form.Label>Ticket Type</Form.Label>
            <Form.Control as="select" value={selectedTicket} onChange={handleTicketChange}>
              <option value="">Select Ticket</option>
              {Object.values(event.tickets).map((ticket) => (
                <option key={ticket.ticketID} value={ticket.ticketID}>
                  {ticket.ticketType} - ${ticket.price}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="quantity" className="mt-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" min="1" value={quantity} onChange={handleQuantityChange} />
          </Form.Group>
          <Form.Group controlId="discount" className="mt-3">
            <Form.Label>Discount</Form.Label>
            <Form.Control as="select" value={selectedDiscount} onChange={handleDiscountChange}>
              <option value="">No Discount</option>
              {selectedTicket &&
                event.tickets[selectedTicket]?.discounts.map((discount) => (
                  <option key={discount.discountID} value={discount.discountID}>
                    {discount.discountName} - {discount.discountPercent}%
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Buy Ticket
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyTicketModal;
