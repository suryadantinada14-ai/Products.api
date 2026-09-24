const express = require('express');
const router = express.Router();
const productController = require('./controllers/productController');
const Product = require('./models/Product');

// Product API Endpoints
router.post('/', productController.createProduct);
router.post('/add-product', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProductById);
router.patch('/:id', productController.updateProductById);
router.put('/update/:id', productController.updateProductById);
router.put('/update-product/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = {
  router,
  Product,
  ...productController
};
