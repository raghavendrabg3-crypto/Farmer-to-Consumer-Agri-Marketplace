const db = require('../config/db');

const createTables = async () => {
    try {
        // 1. Core Farmers Table Setup Node
        await db.query(`
            CREATE TABLE IF NOT EXISTS farmers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address_text TEXT NOT NULL,
                crop_types TEXT[] NOT NULL,
                farming_method VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Marketplace Products/Crops Table Setup Node
        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                farmer_id INTEGER REFERENCES farmers(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price_per_kg NUMERIC(10, 2) NOT NULL,
                available_stock_kg NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Fulfill Orders Tracking Table Setup Node (FORCE SYNCHRONIZED)
        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                consumer_name VARCHAR(255) NOT NULL,
                consumer_phone VARCHAR(50) NOT NULL,
                delivery_address TEXT NOT NULL,
                order_quantity_kg NUMERIC(10, 2) NOT NULL,
                total_price NUMERIC(12, 2) NOT NULL,
                order_status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✨ Core PostgreSQL Table Schemas Synced & Verified successfully.');
    } catch (error) {
        console.error('❌ Database Initialization Error Schema failed:', error.message);
        throw error;
    }
};

module.exports = createTables;