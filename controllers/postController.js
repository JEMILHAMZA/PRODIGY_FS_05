// controllers/postController.js

const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Handle create post
exports.createPost = async (req, res) => {
    try {
        const { caption, location, hashtags, taggedUsers } = req.body;
        const file = req.file;

        console.log('File:', file); // 

        if (!file) {
            return res.status(400).json({ message: "No media uploaded" });
        }

        // Convert usernames to ObjectIds
        let taggedUserIds = [];
        if (taggedUsers) {
            const usernames = taggedUsers.split(',').map(username => username.trim());
            const users = await User.find({ username: { $in: usernames } });
            taggedUserIds = users.map(user => user._id);
        }

        const post = new Post({
            user: req.user._id,
            media: `/uploads/${file.filename}`,
            caption,
            location,
            hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
            taggedUsers: taggedUserIds,
        });

        await post.save();
        res.redirect('/users/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Edit a post
exports.editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption, location, hashtags, taggedUsers } = req.body;
        const file = req.file;

        let post = await Post.findById(postId);

        if (!post || post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Update the post's fields
        post.caption = caption || post.caption;
        post.location = location || post.location;
        post.hashtags = hashtags ? hashtags.split(',').map(tag => tag.trim()) : post.hashtags;
        post.media = file ? `/uploads/${file.filename}` : post.media;

        if (taggedUsers) {
            const usernames = taggedUsers.split(',').map(username => username.trim());
            const users = await User.find({ username: { $in: usernames } });
            post.taggedUsers = users.map(user => user._id);
        }

        await post.save();
        res.redirect('/users/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};








// controllers/postController.js

exports.getEditPostPage = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post by ID
        const post = await Post.findById(postId).populate('taggedUsers', 'username');

        // Check if post exists and belongs to the logged-in user
        if (!post || post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Render the edit post page and pass the post data
        res.render('editPost', { post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



















// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post || post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Remove the post's media file
        const mediaPath = path.join(__dirname, '..', post.media);
        fs.unlink(mediaPath, (err) => {
            if (err) console.error("Failed to delete media:", err);
        });

        await post.deleteOne();
        res.redirect('/users/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};








// Like a post
// Like a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post is already liked by the user
        if (!post.likes.includes(req.user._id)) {
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({ success: true });
        }

        res.status(400).json({ success: false, message: 'Post already liked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Unlike a post
// Unlike a post
exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post is liked by the user
        if (post.likes.includes(req.user._id)) {
            post.likes.pull(req.user._id);
            await post.save();
            return res.status(200).json({ success: true });
        }

        res.status(400).json({ success: false, message: 'Post not liked yet' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};









exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentText } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            user: req.user._id,
            text: commentText,
            date: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.redirect('/users/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};









// Save a post
exports.savePost = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.savedPosts.includes(req.params.postId)) {
            user.savedPosts.push(req.params.postId);
            await user.save();
        }
        res.status(200).json({ success: true, message: 'Post saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Unsave a post
exports.unsavePost = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.savedPosts = user.savedPosts.filter(postId => postId.toString() !== req.params.postId);
        await user.save();
        res.status(200).json({ success: true, message: 'Post unsaved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};