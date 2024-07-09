// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/match_mate_db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for chat messages
const messageSchema = new mongoose.Schema({
    profileName: String,
    sender: String,
    message: String
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

// Endpoint to store chat messages
app.post('/api/messages', async (req, res) => {
    const { profileName, message } = req.body;

    if (!profileName || !message) {
        return res.status(400).json({ error: 'Profile name and message are required' });
    }

    try {
        // Save the message to MongoDB
        const newMessage = new Message({ profileName, sender: 'You', message });
        await newMessage.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Failed to save message to MongoDB:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




