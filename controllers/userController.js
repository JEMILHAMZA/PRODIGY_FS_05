// controllers/userController.js

const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as needed
const Post = require('../models/Post'); // Ensure this line exists
const { formatPostAge } = require('../config/utils');


// Function to handle profile updates
exports.updateProfile = async (req, res) => {
    try {
        const { full_name, username, website, bio, password } = req.body;
        const userId = req.user.id; // Assume user ID is stored in session or JWT

        // Find the user
        let user = await User.findById(userId);

        // Update fields
        user.full_name = full_name;
        user.username = username;
        user.website = website;
        user.bio = bio;

        // Handle profile picture upload
        if (req.file) {
            user.profile_pic = '/uploads/' + req.file.filename;
        }

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save updated user
        await user.save();
        
        res.redirect('/users/dashboard'); // Redirect back to the dashboard after successful update
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};










// Modify the searchUsers method to return JSON data
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const users = await User.find({
            $or: [
                { full_name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]
        }).select('_id profile_pic full_name username');

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};







// Add the toggleFollow method
exports.toggleFollow = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.userId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = req.user.following.includes(userToFollow._id);
        let newFollowerCount = userToFollow.followers.length;

        if (isFollowing) {
            req.user.following.pull(userToFollow._id);
            userToFollow.followers.pull(req.user._id);
            newFollowerCount--; // Decrease follower count
        } else {
            req.user.following.push(userToFollow._id);
            userToFollow.followers.push(req.user._id);
            newFollowerCount++; // Increase follower count
        }

        await req.user.save();
        await userToFollow.save();

        // Respond with JSON containing the updated follower count and follow state
        return res.json({
            isFollowing: !isFollowing, // Return the new state (true if now following)
            followerCount: newFollowerCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

















//////// this oone was use

exports.viewUserProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        const loggedInUserId = req.user.id;
        // const user = await User.findById(req.params.userId)
        //     .select('_id profile_pic full_name username bio followers following')
        //     .populate('followers', 'profile_pic username')
        //     .populate('following', 'profile_pic username');



        const user = await User.findById(req.params.userId)
    .select('_id profile_pic full_name username bio followers following savedPosts')  // Include savedPosts here
    .populate('followers', 'profile_pic username')
    .populate('following', 'profile_pic username');

            

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate('taggedUsers', 'username')
            .populate('user', '_id username profile_pic')
            .populate('comments.user', '_id username profile_pic');

            const savedPosts = await Post.find({ _id: { $in: req.user.savedPosts } })
            .populate('taggedUsers', 'username')
            .populate('user', '_id username profile_pic')
            .populate('comments.user', '_id username profile_pic');

        const isFollowing = req.user.following.includes(user._id);

        // Render the partial
        res.render('_userProfile', {
            token,
            userProfile: user,
            posts,
            savedPosts,
            isFollowing,
            loggedInUserId,
            profileUserId: user._id.toString(),
            followers: user.followers,
            following: user.following,
            user,
            formatPostAge
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};





exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('followers')
            .populate('followers', 'profile_pic username');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ followers: user.followers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};












// controllers/userController.js

// View followers
// exports.viewFollowers = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId)
//             .populate('followers', 'profile_pic username');
        
//         res.render('followers', { followers: user.followers });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// };

// // View following
// exports.viewFollowing = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId)
//             .populate('following', 'profile_pic username');
        
//         res.render('following', { following: user.following });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// };



