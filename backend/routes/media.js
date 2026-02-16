const express = require('express')
const router = express.Router()
const { s3Upload } = require('../config/cloude');
const { uploadMedia } = require('../controllers/media');


router.post('/upload', s3Upload.single('file'), uploadMedia);

module.exports = router