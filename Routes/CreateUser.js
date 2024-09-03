const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt=require("jsonwebtoken");
const jwtSecret="Mynameisankushjain1234"

const bcrypt=require("bcryptjs");

// Route to create a user
router.post('/createuser', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('location').optional().isString().withMessage('Location must be a string') // Optional validation for location
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const salt=await bcrypt.genSalt(10);
    let secPassword=await bcrypt.hash(req.body.password,salt)

    try {
        // Create a new user
        await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location // Use 'location' field
        });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});

router.post('/loginuser', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
    console.log('Login request received');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }

        const pwdCompare=await bcrypt.compare(req.body.password,userData.password)

        if (!pwdCompare) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }
        const data={
            user:{
                id:userData.id
            }
        }

        const authToken=jwt.sign(data,jwtSecret)

        return res.json({ success: true ,authToken:authToken});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;
