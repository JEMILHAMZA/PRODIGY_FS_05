

// // routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const upload = require('../config/multerConfig'); // Import multer config from config file

// Assuming you have a Post model
const Post = require('../models/Post');
const User = require('../models/User');
const { formatPostAge } = require('../config/utils');


// routes/users.js

router.get('/dashboard',  async (req, res) => {
    try {
        const token = req.cookies.token;
        

        // Fetch the user and populate followers and following
        const user = await User.findById(req.user._id)
            .populate('followers', 'username')
            .populate('following', 'username');

        // Fetch all posts except those by the logged-in user
        const allPosts = await Post.find({}).sort({ createdAt: -1 })
        .populate('taggedUsers', 'username')
        .populate('user', '_id username profile_pic')
        .populate('comments.user', '_id username profile_pic');

        // Fetch posts created by the logged-in user
        const myPosts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 })
        .populate('taggedUsers', 'username')
        .populate('user', '_id username profile_pic')
        .populate('comments.user', '_id username profile_pic');

        // Fetch saved posts of the logged-in user
        const savedPosts = await Post.find({ _id: { $in: req.user.savedPosts } })
        .populate('taggedUsers', 'username')
        .populate('user', '_id username profile_pic')
        .populate('comments.user', '_id username profile_pic');

        // Render the main.ejs view with user, allPosts, myPosts, and savedPosts data
        res.render('main', {
            token,
            user,
            allPosts,
            myPosts,
            savedPosts, // Include savedPosts in the rendering context
            postCount: myPosts.length, // Number of posts
            followerCount: user.followers.length, // Number of followers
            followingCount: user.following.length,// Number of following
            formatPostAge, 
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});





// routes/users.js

// Route to get followers of the logged-in user
router.get('/followers', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('followers', 'username profile_pic');
        res.render('followers', { followers: user.followers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to get following of the logged-in user
router.get('/following', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('following', 'username profile_pic');
        res.render('following', { following: user.following });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Add a new route to search for users
router.get('/search',userController.searchUsers);

// Add a new route to view a user's profile
router.get('/:userId', userController.viewUserProfile);

router.get('/:userId/followers', userController.getFollowers);


// Add a route to handle follow/unfollow
router.post('/:userId/follow', userController.toggleFollow);


// // routes/users.js
// Route for viewing other users followers
// router.get('/:userId/followers',userController.viewFollowers);

// // Route for viewing other user following
// router.get('/:userId/following', userController.viewFollowing);

// Route for viewing user profile





// Route to update user profile (protected route)
router.post('/update-profile', upload.single('profile_pic'), userController.updateProfile);

module.exports = router;













 