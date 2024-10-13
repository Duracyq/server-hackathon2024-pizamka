const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express(); // Create an Express application

// Use a dynamic import for PocketBase
const startServer = async () => {
    // Import PocketBase dynamically
    const { default: PocketBase } = await import('pocketbase/cjs'); // Ensure correct import path

    const pb = new PocketBase('http://127.0.0.1:8090'); // Use 'new' to create an instance

    // Endpoint to fetch a paginated records list
    app.get('/wywozy', async (req, res) => {
        try {
            const { adres, createdAfter } = req.query; // Get 'adres' and 'createdAfter' from query string
    
            // Check if required parameters are present
            if (!adres || !createdAfter) {
                return res.status(400).json({ message: 'Missing required parameters: adres or createdAfter' });
            }
    
            // Build the filter query dynamically with multiple conditions
            const filter = `(adres="${adres}")`; 
            console.log(`Filter query: ${filter}`); // Debugging the filter
    
            const records = await pb.collection('wywozy').getList(1, 50, {
                filter, // Using the dynamically built filter
            });
    
            res.json(records); // Send the records as JSON response
        } catch (error) {
            console.error('Error fetching data:', error); 
            res.status(500).json({ message: 'Error fetching data' });
        }
    });

    const PORT = 3000; // Set the port


    app.use(bodyParser.json());

    // Initialize Firebase Admin SDK
    const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Update this path

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    });

    app.post('/send-notification', async (req, res) => {
    const { title, body, token } = req.body;

    const message = {
        notification: {
        title: title,
        body: body,
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending notification');
    }
    });

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
    };

startServer().catch((error) => {
    console.error('Error starting the server:', error);
});


