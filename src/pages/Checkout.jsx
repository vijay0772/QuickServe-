import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import "../styles/checkout.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Checkout = () => {
  const [enterName, setEnterName] = useState("");
  const [enterEmail, setEnterEmail] = useState("");
  const [enterNumber, setEnterNumber] = useState("");
  const [enterCountry, setEnterCountry] = useState("");
  const [enterCity, setEnterCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const cartItems = useSelector(state => state.cart.cartItems);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const dispatch = useDispatch();
  const shippingCost = 30;
  const totalAmount = cartTotalAmount + Number(shippingCost);
  const navigate = useNavigate(); // Hook for navigation

  const submitHandler = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); // Retrieve the user ID from local storage
    const username = localStorage.getItem('username'); // Ensure this is being saved during login

    const orderDetails = {
      userId, // Include the userId in the order details
      username, // Include the username in the order details
      shippingDetails: {
        name: enterName,
        email: enterEmail,
        phone: enterNumber,
        country: enterCountry,
        city: enterCity,
        postalCode: postalCode,
      },
      paymentDetails: {
        cardNumber,
        cardExpiry,
        cardCVV,
      },
      cartItems,
      totalAmount,
    };
    try {
      const response = await fetch('http://localhost:3005/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log('Order submitted successfully:', responseData);
        setOpenDialog(true);  // Open the dialog on successful submission
      } else {
        console.error('Failed to submit order:', responseData.message);
        // Handle errors here
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      // Handle network errors here
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    navigate('/home'); // Navigate to home page after closing the dialog
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8" md="6">
              <h6 className="mb-4">Shipping Address</h6>
              <form className="checkout__form" onSubmit={submitHandler}>
                <div className="form__group">
                  <input type="text" placeholder="Enter your name" required onChange={(e) => setEnterName(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="email" placeholder="Enter your email" required onChange={(e) => setEnterEmail(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="number" placeholder="Phone number" required onChange={(e) => setEnterNumber(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="text" placeholder="Country" required onChange={(e) => setEnterCountry(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="text" placeholder="Address" required onChange={(e) => setEnterCity(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="number" placeholder="Postal code" required onChange={(e) => setPostalCode(e.target.value)} />
                </div>

                {/* Card Details Section */}
                <h6 className="mb-4 mt-4">Payment Information</h6>
                <div className="form__group">
                  <input type="text" placeholder="Card Number" required onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="text" placeholder="Card Expiry (MM/YY)" required onChange={(e) => setCardExpiry(e.target.value)} />
                </div>
                <div className="form__group">
                  <input type="text" placeholder="CVV" required onChange={(e) => setCardCVV(e.target.value)} />
                </div>

                <button type="submit" className="addTOCart__btn">Place Order</button>
              </form>

            </Col>

            <Col lg="4" md="6">
               {/* Display cart items details */}
               {cartItems.length > 0 && (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item-details">
                    <img src={item.image01} alt={item.title} style={{ width: "15px" }} />
                    <div>
                      <h5>{item.title}</h5>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="checkout__bill">
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Subtotal: <span>${cartTotalAmount}</span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping: <span>${shippingCost}</span>
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total: <span>${totalAmount}</span>
                  </h5>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Order Placed Successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for your purchase! Your order has been placed and will be processed soon.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Helmet>
  );
};

export default Checkout;
