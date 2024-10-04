
// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming this is your User model

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/'); // Redirect to the home page where the login form is
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user by ID stored in the token
        const user = await User.findById(decoded.id);

        // If user not found, redirect to login
        if (!user) {
            return res.redirect('/');
        }

        // Attach the full user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = verifyToken;









