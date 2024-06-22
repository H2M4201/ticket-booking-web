import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../config";

const DiscountList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.itemServiceUrl}/discount-list`);
        setEvents(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="row">
      {events.map((event) => (
        <div key={event.discountID} className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card h-100">
            <img src={event.imageUrl} className="card-img-top" alt={event.name} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{event.name}</h5>
              <p className="card-text">{event.description}</p>
              <p className="card-text text-muted">
                Từ: {event.startDate} Đến: {event.endDate}
              </p>
              <p className="card-text text-danger">
                Giảm giá: {event.discountPercentage}%
              </p>
              <a href="#" className="btn btn-primary mt-auto">
                Xem Chi Tiết
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscountList;
