const express = require('express');
const router = express.Router();
const {createKollab, getKollab} = require('../controllers/kollabController.js');

router.post('/', createKollab);
router.get('/:id', getKollab);

module.exports = router;