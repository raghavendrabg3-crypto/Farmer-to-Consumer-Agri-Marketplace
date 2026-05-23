const express = require('express');
const router = express.Router();
const { registerFarmer, getAllFarmers } = require('../controllers/farmerController');

// Map endpoints to controllers
router.route('/')
    .post(registerFarmer)
    .get(getAllFarmers); // <-- Linked the GET request method

module.exports = router;