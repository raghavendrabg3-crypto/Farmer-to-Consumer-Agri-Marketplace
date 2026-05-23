const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/')
    .post(placeOrder)
    .get(getAllOrders);

router.route('/:id')
    .patch(updateOrderStatus);

module.exports = router;