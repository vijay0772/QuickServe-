import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import "../styles/myorders.css";  // Assuming you have a CSS file for custom styles

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (username) {
            fetchOrders(username);
        }
    }, [username]);

    const toggleModal = () => {
        setModal(!modal);
    };

    const fetchOrders = async (username) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://localhost:3005/fetch-user-orders?username=${encodeURIComponent(username)}`);
            const data = await response.json();
            if (response.ok) {
                setOrders(data.data);
            } else {
                console.error('Failed to fetch orders:', data.message);
                setError("Failed to fetch orders. Please try again later.");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError("An error occurred while fetching your orders.");
        }
        setLoading(false);
    };

    const viewDetails = (order) => {
        setCurrentOrderDetails(order);
        toggleModal();
    };

    const trackOrder = (orderId) => {
        alert("Tracking not implemented yet for order ID: " + orderId);
    };

    return (
        <Helmet title="MyOrders">
            <CommonSection title="My Orders" />
            <Container>
                <Row>
                    <Col>
                        {loading ? (
                            <p>Loading your orders...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : orders.length > 0 ? (
                            <Table striped className="text-center">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Total Amount</th>
                                        <th>Actions</th>
                                     </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{order.username}</td>
                                            <td>${order.totalAmount}</td>
                                            <td>
                                                <Button color="info" onClick={() => viewDetails(order)} style={{ marginRight: '10px' }}>
                                                    View Details
                                                </Button>
                                                <Button color="success" onClick={() => trackOrder(order._id)}>
                                                    Track Order
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No orders found.</p>
                        )}
                    </Col>
                </Row>
            </Container>
            {currentOrderDetails && (
                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Order Details</ModalHeader>
                    <ModalBody>
                        <p><strong>Name:</strong> {currentOrderDetails.username}</p>
                        <p><strong>Total Amount:</strong> ${currentOrderDetails.totalAmount}</p>
                        <p><strong>Items:</strong></p>
                        <ul>
                            {currentOrderDetails.cartItems.map((item, index) => (
                                <li key={index}>
                                    <img src={item.image01} alt={item.title} style={{ width: '50px', marginRight: '10px' }} />
                                    {item.title} - Quantity: {item.quantity} - Price: ${item.price}
                                </li>
                            ))}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            )}
        </Helmet>
    );
};

export default MyOrders;









