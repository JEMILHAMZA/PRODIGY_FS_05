// app.js


const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const verifyToken = require('./middleware/auth');


dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
connectDB();



// Home Route
const jwt = require('jsonwebtoken');

// Home Route
app.get('/', (req, res) => {
    // Check if JWT token exists in cookies
    const token = req.cookies.token;
    
    if (token) {
        try {   
            // Verify the token
            jwt.verify(token, process.env.JWT_SECRET);
            // If the token is valid, redirect the user to the dashboard
            return res.redirect('/users/dashboard');
        } catch (err) {
            // If the token is expired or invalid, clear the token
            res.clearCookie('token');
            // Render the index page
            return res.render('index');
        }
    }

    // If no token, render the login/signup page
    res.render('index');
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// User routes
const userRoutes = require('./routes/users');
app.use('/users',verifyToken, userRoutes);

const postRoutes = require('./routes/posts');
app.use('/posts',verifyToken, postRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});