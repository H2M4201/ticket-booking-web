import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import config from '../config';

function DiscountDetail () {
  const { discountID } = useParams();
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchDiscountDetails = async () => {
      try {
        const response = await axios.get(`${config.itemServiceUrl}/discount/${discountID}`);
        console.log(response);
        setDiscount(response.data);

      } catch (error) {
        console.error("Error fetching discount details:", error);
      }
    };

    fetchDiscountDetails();
  }, [discountID]);

  console.log(discount);

  if (!discount) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container">
      
      {/* <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0rKM009sT3Qh-la5UpwgEv2F9iZ0fR_aVA&s"} alt={event.eventName} /> */}
      <h1>{discount.eventName}</h1>
      <p>{discount.eventDescription}</p>
      <p>Location: {discount.eventLocation}</p>
      <p>Start Date: {new Date(discount.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(discount.endDate).toLocaleDateString()}</p>
    </div>
  );
}

export default DiscountDetail;
