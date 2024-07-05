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
        setDiscount(response.data.data);

      } catch (error) {
        console.error("Error fetching discount details:", error);
      }
    };

    fetchDiscountDetails();
  }, []);

  console.log(discount);

  if (!discount) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container px-5 py-3 my-4 col-6" style={{border: "2px black solid", backgroundColor: "#f9ece6", padding: "30px", minHeight: "80vh"}}>
      <div style={{backgroundColor: "f9ece6"}}>
        {/* <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0rKM009sT3Qh-la5UpwgEv2F9iZ0fR_aVA&s"} alt={event.eventName} /> */}
        <h1>{discount['discountName']}</h1>
        <p>{discount.discountDescription}</p>
        <div style={{border: "1px solid rgba(0, 0, 0, 0.1)", marginBottom: "15px"}}></div>
        <p>Start Date: {new Date(discount.discountStartDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(discount.discountEndDate).toLocaleDateString()}</p>
        <p></p>
      </div>
    </div>
  );
}

export default DiscountDetail;
