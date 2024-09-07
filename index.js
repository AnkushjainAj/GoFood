const express = require('express');
const mongoDB = require('./db');
require('dotenv').config(); // Ensure dotenv is configured

const app = express();
const port = process.env.PORT || 5000;

// Initialize the MongoDB connection
mongoDB();

// CORS Middleware
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Ensure this matches your frontend URL
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PUT, DELETE, OPTIONS"
//     );

//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }

//     next();
// });

app.use((req, res, next) => {
    // Allow all origins by setting the Access-Control-Allow-Origin header to *
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Set the allowed headers for CORS
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    // Set the allowed HTTP methods for CORS
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Optional: Set this if you want to allow credentials (e.g., cookies)
    // res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Body parser middleware to handle JSON requests
app.use(express.json());

// Routes
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));

// Root route
app.get('/', (req, res) => {
    res.send("Hello world aj!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
