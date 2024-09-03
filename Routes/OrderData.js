const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// Route for posting new order data
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.unshift({ Order_date: req.body.order_date });

    try {
        // Find an order by email
        let eId = await Order.findOne({ email: req.body.email });

        if (!eId) {
            // Create a new order if email does not exist
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {
            // Update the existing order if email exists
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        }
    } catch (error) {
        console.error("Error saving order data:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
});

// Route for getting order data
router.post('/myOrderData', async (req, res) => {
    try {
        console.log("Fetching order data for email:", req.body.email);

        let eId = await Order.findOne({ email: req.body.email });

        if (!eId) {
            return res.status(404).json({ error: "No orders found for this email" });
        }

        res.json({ orderData: eId });
    } catch (error) {
        console.error("Error fetching order data:", error.message);
        res.status(500).json({ error: "An error occurred while fetching the order data" });
    }
});

module.exports = router;
