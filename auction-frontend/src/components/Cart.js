import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Ensure this file contains the URL for your backend API

const CartPage = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    axios
      .get(`${config.userServiceUrl}/get-checkout?user_id=${user.id || 0}`)
      .then((response) => {
        if (response.data.success) {
          setCartItems(response.data.data);
        } else {
          console.error("Failed to fetch cart items:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the cart items!", error);
      });
  }, [user.id]);

  useEffect(() => {
    // Calculate total price and quantity whenever cart items change
    const calculateTotals = () => {
      let totalPrice = 0;
      let totalQuantity = 0;

      cartItems.forEach((item) => {
        totalPrice += item.paidPrice;
        totalQuantity += item.quantity;
      });

      setTotalPrice(totalPrice);
      setTotalQuantity(totalQuantity);
    };

    calculateTotals();
  }, [cartItems]);

  const handleCheckout = () => {
    axios
      .post(`${config.userServiceUrl}/paid-checkout`, { userID: user.id })
      .then((response) => {
        if (response.data.success) {
          alert(`Checkout successful! Total price: $${response.data.totalPrice.toFixed(2)}`);
          setCartItems([]); // Clear cart after successful checkout
          setTotalPrice(0);
          setTotalQuantity(0);
        } else {
          console.error("Failed to checkout:", response.data.error);
          alert("Checkout failed!");
        }
      })
      .catch((error) => {
        console.error("There was an error during checkout!", error);
        alert("Checkout failed!");
      });
  };

  return (
    <div className="container pt-5">
      <div className="row mt-2">
        <div className="col">
          <h1>Shopping Cart</h1>
        </div>
      </div>
      <div className="row mt-2">
        {cartItems.length === 0 ? (
          <div className="col">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          cartItems.map((item) => (
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <>
          <div className="row mt-2">
            <div className="col">
              <h4>Total Quantity: {totalQuantity}</h4>
              <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              <button className="btn btn-primary" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
