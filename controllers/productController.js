const mongoose = require('mongoose');
const Product = require('../models/Product');

// 1. Create Product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Product name is required"
      });
    }

    if (price === undefined || price === null || typeof price !== 'number' || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number"
      });
    }

    if (stock !== undefined && (typeof stock !== 'number' || isNaN(stock) || stock < 0)) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative"
      });
    }

    const newProduct = new Product({
      name: name.trim(),
      price,
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      stock: stock !== undefined ? stock : 0
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: savedProduct
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create product due to invalid input."
    });
  }
};

// 2. Update Product by ID
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const { name, price, description, category, stock } = req.body;

    // Validate fields if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty"
        });
      }
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number"
        });
      }
    }

    if (stock !== undefined) {
      if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative"
        });
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description.trim();
    if (category !== undefined) updateFields.category = category.trim();
    if (stock !== undefined) updateFields.stock = stock;
    updateFields.updatedAt = Date.now();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update product."
    });
  }
};

// 3. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching products."
    });
  }
};

// 4. Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching product."
    });
  }
};

// 5. Delete Product by ID
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while deleting product."
    });
  }
};

module.exports = {
  createProduct,
  updateProductById,
  getAllProducts,
  getProductById,
  deleteProductById
};
