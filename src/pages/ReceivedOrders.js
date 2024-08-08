import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router v5 or v6
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import OrderRouteMap from './OrderRouteMap'; // Import the map component

const ReceivedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Using react-router's navigate function to redirect

    useEffect(() => {
        console.log('Fetching data...');
        fetchOrders();
    }, []);
    
    const fetchOrders = async () => {
        console.log('Fetching orders from server...');
        const response = await fetch('http://localhost:3005/fetch-processedorders');
        const result = await response.json();
        if (response.ok) {
            console.log('Data received:', result.data);
            setOrders(result.data);  // Assuming the actual orders are in `result.data`
        } else {
            console.log('Failed to fetch orders');
        }
        setLoading(false);
    };
    
    const handleAcceptOrder = (order) => {
        console.log("Order accepted:", order.id);
        navigate('/OrderRouteMap', { state: { customerLocation: order.shippingDetails } });
    };
    
    


    const handleDeclineOrderByName = async (orderName) => {
        if (!orderName) {
            alert('Order name is missing, cannot delete the order.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3005/delete-order-by-name?name=${encodeURIComponent(orderName)}`, {
                method: 'DELETE'
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Optionally update UI state if necessary
                setOrders(prevOrders => prevOrders.filter(order => order.name !== orderName));
                alert('Order has been successfully declined and deleted.');
            } else {
                throw new Error(data.message || 'Failed to delete the order.');
            }
        } catch (error) {
            console.error('Error deleting order by name:', error);
            alert('Error deleting order: ' + error.message);
        }
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    const orderLocation = {
        lat: 40.712776,
        lng: -74.005974,
      };

    return (
        <Helmet title="ReceivedOrders">
            <CommonSection title="Received Orders" />
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
    {orders.map((order, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{order.shippingDetails.name}</td>
            <td>{order.shippingDetails.phone}</td>
            <td>{order.shippingDetails.email}</td>
            <td>{order.shippingDetails.city}</td>
            <td>${order.totalAmount}</td>
            <td>
                <Button color="success" onClick={() => handleAcceptOrder(order)}>Accept Order</Button>
                {' '}
                <Button color="danger" onClick={() => handleDeclineOrderByName(order.shippingDetails.name)}>Decline Order</Button>
            </td>
        </tr>
    ))}
</tbody>
                </Table>
            </Container>
        </Helmet>
        
    );
};

export default ReceivedOrders;
