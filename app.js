const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// IMPORT OUR CONFIGS, MODELS & ROUTES
const db = require('./config/db');
const createTables = require('./models/initSchemas');
const farmerRoutes = require('./routes/farmerRoutes'); 
const productRoutes = require('./routes/productRoutes'); // <-- ADDED IMPORT
const orderRoutes = require('./routes/orderRoutes');     // <-- ADDED IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Security & Utility Middlewares
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public')); // Gives permission to serve frontend UI files

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev')); 
}

// 2. MOUNT OUR CORE FEATURE API ROUTES
app.use('/api/v1/farmers', farmerRoutes); 
app.use('/api/v1/products', productRoutes); // <-- ADDED MOUNT
app.use('/api/v1/orders', orderRoutes);     // <-- ADDED MOUNT

// 3. Base Server Health Check Route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Farm-to-Consumer Core API is up and running perfectly.',
        timestamp: new Date()
    });
});

// 4. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong inside the server engine.'
    });
});

// 5. TEST DATABASE CONNECTION & RUN SCHEMAS
const startServer = async () => {
    try {
        const res = await db.query('SELECT NOW()');
        console.log('🐘 PostgreSQL Database connected successfully at:', res.rows[0].now);
        
        await createTables();
        
        app.listen(PORT, () => {
            console.log(`🚀 Core Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server engine on startup:');
        console.error(error);
        process.exit(1); 
    }
};

startServer();