// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Handle user signup
exports.signup = async (req, res) => {
    const { full_name, username, email, password } = req.body;

    try {
        // Check if the email is already in use
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.render('signup', { message: "Email already in use" });
        }

        // Check if the username is already taken
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.render('signup', { message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            full_name,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('signup', { message: "Server error" });
    }
};

// Handle user login

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email or username
        const user = await User.findOne({ 
            $or: [{ email }, { username: email }] // 'email' here can be either email or username
        });
        if (!user) {
            return res.render('index', { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('index', { message: "Invalid credentials" });
        }

        // Sign and generate JWT
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true });

        
        res.redirect('/users/dashboard');
    } catch (error) {
        console.error(error);
        res.render('index', { message: "Server error" });
    }
};














