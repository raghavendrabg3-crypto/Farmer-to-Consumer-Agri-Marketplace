const express = require('express');
const router = express.Router();
const { listProduct, getAllProducts } = require('../controllers/productController');

router.route('/')
    .post(listProduct)
    .get(getAllProducts);

module.exports = router;