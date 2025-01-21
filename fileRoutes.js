const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ dest: 'public/uploads/' });

// Route for file upload
router.post('/upload', upload.single('file'), fileController.processFile);

module.exports = router;
