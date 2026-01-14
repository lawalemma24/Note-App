const express = require('express');

// Enable mergeParams to access parent route parameters
const router = express.Router({ mergeParams: true });
const {createDiscussion} = require('../controllers/discussionController.js');

router.post('/', createDiscussion);

module.exports = router;