import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";

const EditEventForm = ({ user }) => {
  const { eventID } = useParams();
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
        ticket_name: "",
        ticket_price: "",
        discounts: [
          {
            discount_name: "",
            discount_percent: "",
            discount_description: "",
            discount_start_date: "",
            discount_end_date: ""
          }
        ]
      }
    ],
    photo: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventID) {
      axios
        .get(`${config.itemServiceUrl}/event/${eventID}`)
        .then((response) => {
          const event = response.data.data;
          const tickets = event.tickets.map((ticket) => ({
            ticket_total: ticket.total,
            ticket_name: ticket.ticketType,
            ticket_price: ticket.price,
            discounts: ticket.discounts.map((discount) => ({
              discount_name: discount.discountName,
              discount_percent: discount.discountPercent,
              discount_description: discount.discountDescription,
              discount_start_date: discount.discountStartDate,
              discount_end_date: discount.discountEndDate
            }))
          }));
          setFormData({
            event_name: event.eventName,
            event_desc: event.eventDescription,
            event_loc: event.eventLocation,
            event_start_date: event.startDate,
            event_end_date: event.endDate,
            ticket_start_date: event.openForTicket,
            ticket_end_date: event.closeForTicket,
            tickets: tickets,
            photo: null
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [eventID]);

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

  const handleDiscountChange = (ticketIndex, discountIndex, e) => {
    const { name, value } = e.target;
    const newTickets = [...formData.tickets];
    newTickets[ticketIndex].discounts[discountIndex][name] = value;
    setFormData({ ...formData, tickets: newTickets });
  };

  const addTicket = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tickets: [
        ...prevFormData.tickets,
        {
          ticket_total: "",
          ticket_name: "",
          ticket_price: "",
          discounts: [
            {
              discount_name: "",
              discount_percent: "",
              discount_description: "",
              discount_start_date: "",
              discount_end_date: ""
            }
          ]
        }
      ]
    }));
  };

  const removeTicket = (index) => {
    const newTickets = formData.tickets.filter((_, i) => i !== index);
    setFormData({ ...formData, tickets: newTickets });
  };

  const addDiscount = (ticketIndex) => {
    const newTickets = [...formData.tickets];
    newTickets[ticketIndex].discounts.push({
      discount_name: "",
      discount_percent: "",
      discount_description: "",
      discount_start_date: "",
      discount_end_date: ""
    });
    setFormData({ ...formData, tickets: newTickets });
  };

  const removeDiscount = (ticketIndex, discountIndex) => {
    const newTickets = [...formData.tickets];
    newTickets[ticketIndex].discounts = newTickets[ticketIndex].discounts.filter((_, i) => i !== discountIndex);
    setFormData({ ...formData, tickets: newTickets });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("event_id", eventID);
    form.append("event_name", formData.event_name);
    form.append("event_desc", formData.event_desc);
    form.append("event_loc", formData.event_loc);
    form.append("event_start_date", formData.event_start_date);
    form.append("event_end_date", formData.event_end_date);
    form.append("ticket_start_date", formData.ticket_start_date);
    form.append("ticket_end_date", formData.ticket_end_date);
    form.append("file", formData.photo);
    form.append("user_id", user.id);

    formData.tickets.forEach((ticket, ticketIndex) => {
      form.append(`tickets[${ticketIndex}][ticket_total]`, ticket.ticket_total);
      form.append(`tickets[${ticketIndex}][ticket_name]`, ticket.ticket_name);
      form.append(`tickets[${ticketIndex}][ticket_price]`, ticket.ticket_price);

      ticket.discounts.forEach((discount, discountIndex) => {
        form.append(`tickets[${ticketIndex}][discounts][${discountIndex}][discount_name]`, discount.discount_name);
        form.append(
          `tickets[${ticketIndex}][discounts][${discountIndex}][discount_percent]`,
          discount.discount_percent
        );
        form.append(
          `tickets[${ticketIndex}][discounts][${discountIndex}][discount_description]`,
          discount.discount_description
        );
        form.append(
          `tickets[${ticketIndex}][discounts][${discountIndex}][discount_start_date]`,
          discount.discount_start_date
        );
        form.append(
          `tickets[${ticketIndex}][discounts][${discountIndex}][discount_end_date]`,
          discount.discount_end_date
        );
      });
    });

    try {
      const url = `${config.itemServiceUrl}/update-event`;
      const response = await axios.post(url, form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200) {
        alert("Event updated successfully");
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
              ticket_name: "",
              ticket_price: "",
              discounts: [
                {
                  discount_name: "",
                  discount_percent: "",
                  discount_description: "",
                  discount_start_date: "",
                  discount_end_date: ""
                }
              ]
            }
          ],
          photo: null
        });

        navigate(`/event/${eventID}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container pt-5">
      <div className="row mt-2">
        <div className="col">
          <h1>{eventID ? "Edit Event" : "Add Event"}</h1>
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
              Event Description:
            </label>
            <textarea
              className="form-control"
              id="event_desc"
              name="event_desc"
              value={formData.event_desc}
              onChange={handleChange}
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
              type="datetime-local"
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
              type="datetime-local"
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
              type="datetime-local"
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
              type="datetime-local"
              className="form-control"
              id="ticket_end_date"
              name="ticket_end_date"
              value={formData.ticket_end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <h1>Ticket Types</h1>
          </div>
        </div>
        {formData.tickets.map((ticket, ticketIndex) => (
          <div key={ticketIndex} className="ticket-section">
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_name_${ticketIndex}`} className="form-label">
                  Ticket Name:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`ticket_name_${ticketIndex}`}
                  name="ticket_name"
                  value={ticket.ticket_name}
                  onChange={(e) => handleTicketChange(ticketIndex, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_total_${ticketIndex}`} className="form-label">
                  Total Tickets:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`ticket_total_${ticketIndex}`}
                  name="ticket_total"
                  value={ticket.ticket_total}
                  onChange={(e) => handleTicketChange(ticketIndex, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <label htmlFor={`ticket_price_${ticketIndex}`} className="form-label">
                  Ticket Price:<strong style={{ color: "red" }}>*</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`ticket_price_${ticketIndex}`}
                  name="ticket_price"
                  value={ticket.ticket_price}
                  onChange={(e) => handleTicketChange(ticketIndex, e)}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <h2>Discounts</h2>
              </div>
            </div>
            {ticket.discounts.map((discount, discountIndex) => (
              <div key={discountIndex} className="discount-section">
                <div className="row mt-2">
                  <div className="col-4">
                    <label htmlFor={`discount_name_${ticketIndex}_${discountIndex}`} className="form-label">
                      Discount Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`discount_name_${ticketIndex}_${discountIndex}`}
                      name="discount_name"
                      value={discount.discount_name}
                      onChange={(e) => handleDiscountChange(ticketIndex, discountIndex, e)}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-4">
                    <label htmlFor={`discount_percent_${ticketIndex}_${discountIndex}`} className="form-label">
                      Discount Percent:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`discount_percent_${ticketIndex}_${discountIndex}`}
                      name="discount_percent"
                      value={discount.discount_percent}
                      onChange={(e) => handleDiscountChange(ticketIndex, discountIndex, e)}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-4">
                    <label htmlFor={`discount_description_${ticketIndex}_${discountIndex}`} className="form-label">
                      Discount Description:
                    </label>
                    <textarea
                      className="form-control"
                      id={`discount_description_${ticketIndex}_${discountIndex}`}
                      name="discount_description"
                      value={discount.discount_description}
                      onChange={(e) => handleDiscountChange(ticketIndex, discountIndex, e)}
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-4">
                    <label htmlFor={`discount_start_date_${ticketIndex}_${discountIndex}`} className="form-label">
                      Discount Start Date:
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id={`discount_start_date_${ticketIndex}_${discountIndex}`}
                      name="discount_start_date"
                      value={discount.discount_start_date}
                      onChange={(e) => handleDiscountChange(ticketIndex, discountIndex, e)}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-4">
                    <label htmlFor={`discount_end_date_${ticketIndex}_${discountIndex}`} className="form-label">
                      Discount End Date:
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id={`discount_end_date_${ticketIndex}_${discountIndex}`}
                      name="discount_end_date"
                      value={discount.discount_end_date}
                      onChange={(e) => handleDiscountChange(ticketIndex, discountIndex, e)}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-4">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeDiscount(ticketIndex, discountIndex)}
                    >
                      Remove Discount
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="row mt-2">
              <div className="col-4">
                <button type="button" className="btn btn-secondary" onClick={() => addDiscount(ticketIndex)}>
                  Add Discount
                </button>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-4">
                <button type="button" className="btn btn-danger" onClick={() => removeTicket(ticketIndex)}>
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
              Event Photo:
            </label>
            <input type="file" className="form-control" id="photo" name="photo" onChange={handleChange} />
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

export default EditEventForm;
