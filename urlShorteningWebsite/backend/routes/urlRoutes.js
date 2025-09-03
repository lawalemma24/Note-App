const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const statController = require('../controllers/statController');

// Encode a URL
router.post('/encode', urlController.encodeUrl);

// Decode a URL
router.get('/decode', urlController.decodeUrl);

// Get URL statistics
router.get('/statistic/:urlPath', statController.getUrlStats);

// List all URLs
router.get('/list', urlController.listUrls);

// Redirect short URL
router.get('/:urlPath', urlController.redirectUrl);

module.exports = router;