
const express = require('express');
const router = express.Router();
const {createIdea,listIdeas,getIdea} = require('../controllers/ideaController.js');

router.post('/createidea', createIdea);
router.get('/list', listIdeas);
router.get('/:id', getIdea);

module.exports = router;