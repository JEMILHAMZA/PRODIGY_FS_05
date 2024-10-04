// config/multerConfig.js

// const multer = require('multer');
// const path = require('path');

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Destination folder for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
//     }
// });

// // File filter for images only
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true); // Accept file
//     } else {
//         cb(new Error('Invalid file type, only images are allowed'), false); // Reject file
//     }
// };

// // Export multer setup
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// });

// module.exports = upload;




















// config/multerConfig.js

const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
    }
});

// File filter for images, videos, and audio files
const fileFilter = (req, file, cb) => {
    
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',            // Image types
        'video/mp4', 'video/mpeg', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv', 'video/flv',  // Video types
        'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/flac'  // Audio types
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type, only images, videos, and audio are allowed'), false); // Reject file
    }
};

// Export multer setup
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
