const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProductById,
  getAllProducts,
  getProductById,
  deleteProductById
} = require('../controllers/productController');

// Create Product (supports standard REST and legacy alias)
router.post('/', createProduct);
router.post('/add-product', createProduct);

// Get All Products
router.get('/', getAllProducts);

// Get Product by ID
router.get('/:id', getProductById);

// Update Product by ID (supports PUT, PATCH, and legacy aliases)
router.put('/:id', updateProductById);
router.patch('/:id', updateProductById);
router.put('/update/:id', updateProductById);
router.put('/update-product/:id', updateProductById);

// Delete Product by ID
router.delete('/:id', deleteProductById);

module.exports = router;
