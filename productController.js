const db = require('../config/db');

// @desc    List a new product under a farmer profile
const listProduct = async (req, res) => {
    try {
        const { farmer_id, title, category, price_per_kg, available_stock_kg } = req.body;

        if (!farmer_id || !title || !category || !price_per_kg || !available_stock_kg) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all required product details.'
            });
        }

        const insertQuery = `
            INSERT INTO products (farmer_id, title, category, price_per_kg, available_stock_kg)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [farmer_id, title, category, price_per_kg, available_stock_kg];
        const result = await db.query(insertQuery, values);

        res.status(201).json({
            status: 'success',
            data: { product: result.rows[0] }
        });
    } catch (error) {
        console.error('❌ Error inside listProduct controller:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

// @desc    Get all listed products with farmer names
const getAllProducts = async (req, res) => {
    try {
        const selectQuery = `
            SELECT p.*, f.name as farmer_name 
            FROM products p
            JOIN farmers f ON p.farmer_id = f.id
            ORDER BY p.created_at DESC;
        `;
        const result = await db.query(selectQuery);

        res.status(200).json({
            status: 'success',
            results: result.rowCount,
            data: { products: result.rows }
        });
    } catch (error) {
        console.error('❌ Error inside getAllProducts controller:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

module.exports = {
    listProduct,
    getAllProducts
};