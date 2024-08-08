const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Ensure you have 'node-fetch' installed
const cors = require('cors');
const https = require('https'); // Required for HTTPS Agent
const app = express();
const PORT = 3005;

const username = 'elastic';
const password = '3zy-1uFcrdMILzTOGWbz';
const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

// CORS configuration to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3001' // Adjust this according to your frontend's URL
}));

// Body parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to submit contact form data
app.post('/submit-contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Create an HTTPS agent that ignores SSL certificate errors
    const agent = new https.Agent({
        rejectUnauthorized: false // Disables SSL validation; use cautiously!
    });

    // Make a POST request to Elasticsearch
    const response = await fetch('https://localhost:9200/contacts/_doc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
        },
        body: JSON.stringify({
            name,
            email,
            message
        }),
        agent: agent // Use the custom HTTPS agent
    });

    // Handle the response from Elasticsearch
    if (response.ok) {
        const jsonResponse = await response.json();
        res.send({ status: 'success', data: jsonResponse });
    } else {
        // If the Elasticsearch server returns an error
        res.status(500).send({ status: 'error', message: 'Failed to insert data into Elasticsearch' });
    }
});

// Route to get contact form data from Elasticsearch
app.get('/fetch-contacts', async (req, res) => {
    const agent = new https.Agent({
        rejectUnauthorized: false // Disables SSL validation; use cautiously!
    });

    try {
        const response = await fetch('https://localhost:9200/contacts/_search', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
            },
            agent: agent
        });
        const jsonResponse = await response.json();
        if (response.ok) {
            res.send({ status: 'success', data: jsonResponse.hits.hits.map(hit => hit._source) });
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send({ status: 'error', message: 'Failed to fetch data from Elasticsearch' });
    }
});

app.post('/submit-order', async (req, res) => {
    const orderData = req.body; // This should include userId and username

    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch('https://localhost:9200/orders_v3/_doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
            },
            body: JSON.stringify(orderData),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            res.send({ status: 'success', data: jsonResponse });
        } else {
            throw new Error(`Failed to insert data into Elasticsearch: ${jsonResponse.error ? jsonResponse.error.reason : 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});


app.get('/fetch-user-orders', async (req, res) => {
    const username = req.query.username; // Receive the username from the query parameter
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    if (!username) {
        return res.status(400).send({ status: 'error', message: 'Username is required to fetch orders.' });
    }

    try {
        const response = await fetch(`https://localhost:9200/orders_v3/_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: JSON.stringify({
                query: {
                    match: { username: username }  // Filter orders by username
                }
            }),
            agent: httpsAgent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            res.send({ status: 'success', data: jsonResponse.hits.hits.map(hit => hit._source) });
        } else {
            throw new Error('Failed to fetch user orders');
        }
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});



// Route to get all order data from Elasticsearch
app.get('/fetch-orders', async (req, res) => {
    const size = req.query.size ? parseInt(req.query.size, 10) : 10; // Default to 10, or take the provided query param
    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch('https://localhost:9200/orders_v3/_search', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: {
                    match_all: {}
                },
                size: size
            }),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            const orders = jsonResponse.hits.hits.map(hit => hit._source);
            res.send({ status: 'success', data: orders });
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send({ status: 'error', message: 'Failed to fetch data from Elasticsearch' });
    }
});


app.post('/submit-processedorders', async (req, res) => {
    const orderData = req.body;
    const agent = new https.Agent({
      rejectUnauthorized: false  // Only for development!
    });
  
    try {
      const response = await fetch('https://localhost:9200/processed_orders/_doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
        },
        body: JSON.stringify(orderData),
        agent: agent
      });
  
      const jsonResponse = await response.json();
      if (response.ok) {
        res.send({ status: 'success', data: jsonResponse });
      } else {
        throw new Error(`Failed to insert data into Elasticsearch: ${jsonResponse.error ? jsonResponse.error.reason : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).send({ status: 'error', message: error.message });
    }
  });
  
  
  // Route to get all processed order data from Elasticsearch
app.get('/fetch-processedorders', async (req, res) => {
    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch('https://localhost:9200/processed_orders/_search', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
            },
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            const orders = jsonResponse.hits.hits.map(hit => hit._source);
            res.send({ status: 'success', data: orders });
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send({ status: 'error', message: 'Failed to fetch data from Elasticsearch' });
    }
});






app.delete('/delete-order-by-name', async (req, res) => {
    const orderName = req.query.name;  // Getting the name from query parameters

    if (!orderName) {
        return res.status(400).send({ status: 'error', message: 'Order name is required.' });
    }

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    // Step 1: Search for the order ID using the order name
    const searchUrl = `https://localhost:9200/processed_orders/_search`;
    try {
        const searchResponse = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Credentials}`,
            },
            body: JSON.stringify({
                query: {
                    match: { "shippingDetails.name.keyword": orderName }
                }
            }),
            agent: httpsAgent
        });

        const searchData = await searchResponse.json();

        if (!searchResponse.ok || searchData.hits.hits.length === 0) {
            return res.status(404).send({ status: 'error', message: 'Order not found with given name.' });
        }

        // Step 2: Delete the order using the retrieved ID
        const orderId = searchData.hits.hits[0]._id;
        const deleteUrl = `https://localhost:9200/processed_orders/_doc/${orderId}`;
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
            },
            agent: httpsAgent
        });

        if (!deleteResponse.ok) {
            const deleteData = await deleteResponse.json();
            throw new Error(`Failed to delete the order: ${deleteData.error?.reason || 'Unknown error'}`);
        }

        res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order by name:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});




// Ensure this endpoint is added to handle creating a notification
app.post('/create-notification', async (req, res) => {
    const { username, message } = req.body;
    const notificationData = {
        username,
        message,
        timestamp: new Date()
    };

    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch('https://localhost:9200/notificationss/_doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64Credentials
            },
            body: JSON.stringify(notificationData),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            res.send({ status: 'success', data: jsonResponse });
        } else {
            throw new Error('Failed to create notification');
        }
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Route to fetch notifications for a specific user
app.get('/fetch-notifications', async (req, res) => {
    const username = req.query.username;
    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch(`https://localhost:9200/notificationss/_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64Credentials
            },
            body: JSON.stringify({
                query: {
                    match: { username: username }
                }
            }),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            const notifications = jsonResponse.hits.hits.map(hit => hit._source);
            res.send({ status: 'success', data: notifications });
        } else {
            throw new Error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

app.post('/submit-review', async (req, res) => {
    const { username, email, message, product_id } = req.body;

    const reviewData = {
        username,
        email,
        message,
        product_id,
        timestamp: new Date()  // Store the current timestamp
    };

    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch('https://localhost:9200/reviews/_doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
            },
            body: JSON.stringify(reviewData),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            res.send({ status: 'success', data: jsonResponse });
        } else {
            throw new Error(`Failed to insert review into Elasticsearch: ${jsonResponse.error ? jsonResponse.error.reason : 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Route to fetch reviews for a specific product
app.get('/fetch-reviews', async (req, res) => {
    const { product_id } = req.query;

    const agent = new https.Agent({
        rejectUnauthorized: false  // Only for development!
    });

    try {
        const response = await fetch(`https://localhost:9200/reviews/_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('elastic:3zy-1uFcrdMILzTOGWbz').toString('base64')
            },
            body: JSON.stringify({
                query: {
                    match: { product_id: product_id }
                }
            }),
            agent: agent
        });

        const jsonResponse = await response.json();
        if (response.ok) {
            const reviews = jsonResponse.hits.hits.map(hit => hit._source);
            res.send({ status: 'success', data: reviews });
        } else {
            throw new Error('Failed to fetch reviews');
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
