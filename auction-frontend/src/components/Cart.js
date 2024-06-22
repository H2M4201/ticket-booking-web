import React, { useState, useEffect } from "react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Dummy data for cart items
    const dummyCartItems = [
      {
        shoppingcartRecordID: 1,
        name: "Worlds 2024 Ticket",
        description: "Ticket for League of Legends finals in Beijing.",
        endDate: "2024-11-23",
        dealPrice: 150.0,
        shippingCosts: 10.0,
        quantity: 1
      },
      {
        shoppingcartRecordID: 2,
        name: "World Cup 2022 Ticket",
        description: "Ticket for World Cup 2022 in Qatar.",
        endDate: "2022-12-18",
        dealPrice: 300.0,
        shippingCosts: 15.0,
        quantity: 2
      }
    ];

    setCartItems(dummyCartItems);
  }, []);

  const handleCheckout = () => {
    alert("Checkout successful! Dummy checkout process completed.");
    setCartItems([]); // Clear cart after successful checkout
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
            <div key={item.shoppingcartRecordID} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">
                    <strong>End Date:</strong> {item.endDate}
                  </p>
                  <p className="card-text">
                    <strong>Deal Price:</strong> ${item.dealPrice}
                  </p>
                  <p className="card-text">
                    <strong>Shipping Costs:</strong> ${item.shippingCosts}
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
        <div className="row mt-2">
          <div className="col">
            <button className="btn btn-primary" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
