const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Ensure SRV records for MongoDB Atlas resolve cleanly on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS cannot be configured
}

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User & Product REST API is running'
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

// Start server if directly executed
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
} else {
  // If imported by test runner
  connectDB().catch((err) => {
    console.error('Test connection error:', err);
  });
}

module.exports = app;
