// routes/auth.js

const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// POST Login
router.post('/', login);

// GET Signup Form
router.get('/signup', (req, res) => {
    res.render('signup');
});

// POST Signup
router.post('/signup', signup);

// GET Logout (Logout and redirect to home)
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token from cookies
    res.redirect('/'); // Redirect to home page
});

module.exports = router;





