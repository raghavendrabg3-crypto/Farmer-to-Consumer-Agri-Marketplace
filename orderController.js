const db = require('../config/db');

// @desc    Place a new order for a crop product
const placeOrder = async (req, res) => {
    try {
        const { product_id, consumer_name, consumer_phone, delivery_address, order_quantity_kg } = req.body;

        if (!product_id || !consumer_name || !consumer_phone || !delivery_address || !order_quantity_kg) {
            return res.status(400).json({ status: 'fail', message: 'Missing required ordering fields.' });
        }

        const productQuery = 'SELECT * FROM products WHERE id = $1;';
        const productRes = await db.query(productQuery, [product_id]);

        if (productRes.rows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Product not found.' });
        }

        const product = productRes.rows[0];
        if (parseFloat(product.available_stock_kg) < parseFloat(order_quantity_kg)) {
            return res.status(400).json({ status: 'fail', message: 'Insufficient stock available for this crop.' });
        }

        const total_price = parseFloat(product.price_per_kg) * parseFloat(order_quantity_kg);

        const insertOrderQuery = `
            INSERT INTO orders (product_id, consumer_name, consumer_phone, delivery_address, order_quantity_kg, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const orderResult = await db.query(insertOrderQuery, [product_id, consumer_name, consumer_phone, delivery_address, order_quantity_kg, total_price]);

        res.status(201).json({
            status: 'success',
            data: { order: orderResult.rows[0] }
        });
    } catch (error) {
        console.error('❌ Error inside placeOrder:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

// @desc    Get all active orders
const getAllOrders = async (req, res) => {
    try {
        const selectQuery = `
            SELECT o.*, p.title as product_title, f.name as farmer_name
            FROM orders o
            JOIN products p ON o.product_id = p.id
            JOIN farmers f ON p.farmer_id = f.id
            ORDER BY o.created_at DESC;
        `;
        const result = await db.query(selectQuery);
        res.status(200).json({ status: 'success', data: { orders: result.rows } });
    } catch (error) {
        console.error('❌ Error inside getAllOrders:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

// @desc    Farmer updates the state of an order (e.g., Confirm Order)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        const updateQuery = `
            UPDATE orders 
            SET order_status = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await db.query(updateQuery, [order_status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Order record not found.' });
        }

        if (order_status === 'Confirmed') {
            const currentOrder = result.rows[0];
            const deductStockQuery = `
                UPDATE products 
                SET available_stock_kg = available_stock_kg - $1 
                WHERE id = $2;
            `;
            await db.query(deductStockQuery, [currentOrder.order_quantity_kg, currentOrder.product_id]);
        }

        res.status(200).json({
            status: 'success',
            data: { order: result.rows[0] }
        });
    } catch (error) {
        console.error('❌ Error inside updateOrderStatus:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

module.exports = { placeOrder, getAllOrders, updateOrderStatus };