import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3005/fetch-orders?size=100');
      const data = await response.json();
      if (data.status === 'success') {
        setOrders(data.data);
      } else {
        throw new Error(data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const toggle = () => setModal(!modal);
  const toggleConfirmationModal = () => {
    setConfirmationModal(!confirmationModal);
    if (!confirmationModal) {
      navigate('/home');
    }
  };

  const showDetails = (order) => {
    setSelectedOrder(order);
    toggle();
  };

  const handleAssignDeliveryPerson = async () => {
    console.log("Assigning order to delivery:", selectedOrder);
    try {
      const response = await fetch('http://localhost:3005/submit-processedorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedOrder)
      });

      const data = await response.json();
      if (response.ok) {
        toggle(); // Close the order details modal
        toggleConfirmationModal(); // Open the confirmation modal
      } else {
        throw new Error(data.message || 'Failed to send the order for delivery.');
      }
    } catch (error) {
      console.error('Failed to assign delivery person:', error);
      alert('Error sending order for delivery: ' + error.message);
    }
  };

  
  const notifyUser = async (order) => {
    try {
        const response = await fetch(`http://localhost:3005/create-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: order.username,
                message: `Your Order Has been delivered succesfully.`
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Order Updated!');
        } else {
            throw new Error(result.message || 'Failed to send notification.');
        }
    } catch (error) {
        alert(`Error sending notification: ${error.message}`);
    }
};

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <Helmet title="Orders">
      <CommonSection title="Customer Orders" />
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.username}</td>
                <td>{order.shippingDetails.email}</td>
                <td>${order.totalAmount}</td>
                <td>
                  <Button color="info" onClick={() => showDetails(order)}>View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {selectedOrder && (
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Order Details</ModalHeader>
            <ModalBody>
              <p><strong>Name:</strong> {selectedOrder.shippingDetails.name}</p>
              <p><strong>Email:</strong> {selectedOrder.shippingDetails.email}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingDetails.city}</p>
              <p><strong>PostalCode:</strong> {selectedOrder.shippingDetails.postalCode}</p>
              <p><strong>Country:</strong> {selectedOrder.shippingDetails.country}</p>
              <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
              <hr />
              <h5>Items Ordered:</h5>
              {selectedOrder.cartItems.map(item => (
                <div key={item.id} style={{ marginBottom: "10px" }}>
                  <img src={item.image01} alt={item.title} style={{ width: "50px", marginRight: "10px" }} />
                  <span><strong>{item.title}</strong> - Quantity: {item.quantity}</span>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>Close</Button>
              <Button color="success" onClick={handleAssignDeliveryPerson}>Order Ready</Button>
              <Button color="primary" onClick={() => notifyUser(selectedOrder)}>Update Status</Button>
            </ModalFooter>
          </Modal>
        )}
        <Modal isOpen={confirmationModal} toggle={toggleConfirmationModal} size="lg">
          <ModalHeader toggle={toggleConfirmationModal}>Confirmation</ModalHeader>
          <ModalBody>Your order has been sent for delivery!</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleConfirmationModal}>OK</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </Helmet>
  );
};

export default Orders;
