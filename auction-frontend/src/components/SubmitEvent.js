import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const SubmitEventForm = ({ user }) => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_desc: "",
    event_loc: "",
    event_start_date: "",
    event_end_date: "",
    ticket_start_date: "",
    ticket_end_date: "",
    tickets: [
      {
        ticket_total: "",
        ticket_sold: "",
        ticket_name: "",
        ticket_price: ""
      }
    ],
    photo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value
    }));
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const newTickets = [...formData.tickets];
    newTickets[index][name] = value;
    setFormData({ ...formData, tickets: newTickets });
  };

  const addTicket = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tickets: [...prevFormData.tickets, { ticket_total: "", ticket_sold: "", ticket_name: "", ticket_price: "" }]
    }));
  };

  const removeTicket = (index) => {
    const newTickets = formData.tickets.filter((_, i) => i !== index);
    setFormData({ ...formData, tickets: newTickets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("event_name", formData.event_name);
    form.append("event_desc", formData.event_desc);
    form.append("event_loc", formData.event_loc);
    form.append("event_start_date", formData.event_start_date);
    form.append("event_end_date", formData.event_end_date);
    form.append("ticket_start_date", formData.ticket_start_date);
    form.append("ticket_end_date", formData.ticket_end_date);
    form.append("file", formData.photo);
    form.append("userID", user.id);

    formData.tickets.forEach((ticket, index) => {
      form.append(`tickets[${index}][ticket_total]`, ticket.ticket_total);
      form.append(`tickets[${index}][ticket_sold]`, ticket.ticket_sold);
      form.append(`tickets[${index}][ticket_name]`, ticket.ticket_name);
      form.append(`tickets[${index}][ticket_price]`, ticket.ticket_price);
    });

    try {
      const response = await axios.post(`${config.itemServiceUrl}/submit-event`, form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200) {
        alert("Listing submitted successfully");
        setFormData({
          event_name: "",
          event_desc: "",
          event_loc: "",
          event_start_date: "",
          event_end_date: "",
          ticket_start_date: "",
          ticket_end_date: "",
          tickets: [
            {
              ticket_total: "",
              ticket_sold: "",
              ticket_name: "",
              ticket_price: ""
            }
          ],
          photo: null
        });
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert("Failed to submit listing");
    }
  };

  return (
    <div className="container pt-5">
      <div className="row mt-2">
        <div className="col">
          <h1>Add Event</h1>
        </div>
      </div>
      <div className="row mt-2">
        <h4>
          Fields marked with a red asterisk (<span style={{ color: "red" }}>*</span>) are required.
        </h4>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="event_name" className="form-label">
              Event Name:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="text"
              className="form-control"
              id="event_name"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="event_desc" className="form-label">
              Event Description:<strong style={{ color: "red" }}>*</strong>
            </label>
            <textarea
              className="form-control"
              id="event_desc"
              name="event_desc"
              value={formData.event_desc}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="event_loc" className="form-label">
              Event Location:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="text"
              className="form-control"
              id="event_loc"
              name="event_loc"
              value={formData.event_loc}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="event_start_date" className="form-label">
              Event Start Date:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="date"
              className="form-control"
              id="event_start_date"
              name="event_start_date"
              value={formData.event_start_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="event_end_date" className="form-label">
              Event End Date:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="date"
              className="form-control"
              id="event_end_date"
              name="event_end_date"
              value={formData.event_end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="ticket_start_date" className="form-label">
              Ticket Start Date:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="date"
              className="form-control"
              id="ticket_start_date"
              name="ticket_start_date"
              value={formData.ticket_start_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="ticket_end_date" className="form-label">
              Ticket End Date:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input
              type="date"
              className="form-control"
              id="ticket_end_date"
              name="ticket_end_date"
              value={formData.ticket_end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {formData.tickets.map((ticket, index) => (
          <div key={index} className="ticket-section">
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_name_${index}`} className="form-label">
                  Ticket Name:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`ticket_name_${index}`}
                  name="ticket_name"
                  value={ticket.ticket_name}
                  onChange={(e) => handleTicketChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_total_${index}`} className="form-label">
                  Total Tickets:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`ticket_total_${index}`}
                  name="ticket_total"
                  value={ticket.ticket_total}
                  onChange={(e) => handleTicketChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_sold_${index}`} className="form-label">
                  Tickets Sold:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`ticket_sold_${index}`}
                  name="ticket_sold"
                  value={ticket.ticket_sold}
                  onChange={(e) => handleTicketChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_price_${index}`} className="form-label">
                  Ticket Price:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`ticket_price_${index}`}
                  name="ticket_price"
                  value={ticket.ticket_price}
                  onChange={(e) => handleTicketChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <button type="button" className="btn btn-danger" onClick={() => removeTicket(index)}>
                  Remove Ticket
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="row mt-2">
          <div className="col-4">
            <button type="button" className="btn btn-secondary" onClick={addTicket}>
              Add Ticket
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-4">
            <label htmlFor="photo" className="form-label">
              Event Photo:<strong style={{ color: "red" }}>*</strong>
            </label>
            <input type="file" className="form-control" id="photo" name="photo" onChange={handleChange} required />
          </div>
        </div>

        <div className="row my-5">
          <div className="col-4">
            <button className="btn main-button btn-primary" type="submit">
              Submit Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitEventForm;
