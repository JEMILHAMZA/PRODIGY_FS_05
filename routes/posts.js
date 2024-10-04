// routes/posts.js

const express = require('express');
const router = express.Router();
const { likePost,unlikePost,createPost,editPost, deletePost,addComment ,savePost, unsavePost,getEditPostPage} = require('../controllers/postController');

const verifyToken = require('../middleware/auth');

const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../config/multerConfig'); // Use the existing config




// Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// Create post
router.post('/create',upload.single('media'), createPost);



// Route to edit a specific post
router.post('/edit/:postId', upload.single('media'), editPost);









// routes/posts.js

// Route to get the edit post page
router.get('/edit/:postId', verifyToken, getEditPostPage);








// Route to delete a specific post
router.post('/delete/:postId',deletePost);


// Like a post
router.post('/like/:postId',likePost);

// Unlike a post
router.post('/unlike/:postId',  unlikePost);

router.post('/:postId/comment', addComment);

// Save a post
router.post('/save/:postId',  savePost);

// Unsave a post
router.post('/unsave/:postId', unsavePost);













module.exports = router;








