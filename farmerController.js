const db = require('../config/db');

// @desc    Register a brand new farmer profile
// @route   POST /api/v1/farmers
const registerFarmer = async (req, res) => {
    try {
        const { name, address_text, crop_types, farming_method, baseline_income_per_month } = req.body;

        if (!name || !address_text || !crop_types || !farming_method) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all required fields.'
            });
        }

        const insertQuery = `
            INSERT INTO farmers (name, address_text, crop_types, farming_method, baseline_income_per_month)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [name, address_text, crop_types, farming_method, baseline_income_per_month || 0.00];
        const result = await db.query(insertQuery, values);

        res.status(201).json({
            status: 'success',
            data: { farmer: result.rows[0] }
        });
    } catch (error) {
        console.error('❌ Error inside registerFarmer controller:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

// @desc    Get all registered farmers
// @route   GET /api/v1/farmers
const getAllFarmers = async (req, res) => {
    try {
        // Query to select all entries from the farmers table ordered by newest first
        const selectQuery = 'SELECT * FROM farmers ORDER BY created_at DESC;';
        const result = await db.query(selectQuery);

        res.status(200).json({
            status: 'success',
            results: result.rowCount,
            data: {
                farmers: result.rows
            }
        });
    } catch (error) {
        console.error('❌ Error inside getAllFarmers controller:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching farmer profiles.'
        });
    }
};

module.exports = {
    registerFarmer,
    getAllFarmers // <-- Exporting the new function
};