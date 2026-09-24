# Product API Documentation

This document describes all Product REST APIs implemented in the session:
1. **Create Product** (`POST /api/products`)
2. **Update Product by ID** (`PUT /api/products/:id` or `PATCH /api/products/:id`)
3. **Get All Products** (`GET /api/products`)
4. **Get Product by ID** (`GET /api/products/:id`)
5. **Delete Product by ID** (`DELETE /api/products/:id`)

Base URL: `http://localhost:3000`

---

## 1. Create Product

* **Description:** Creates a new product and saves it to MongoDB.
* **HTTP Method:** `POST`
* **Endpoint:** `/api/products` (alias: `/products`, `/api/products/add-product`)
* **Headers:** `Content-Type: application/json`

### Request Body:
```json
{
  "name": "Wireless Noise-Canceling Headphones",
  "price": 199.99,
  "description": "Premium over-ear wireless headphones with active noise cancellation.",
  "category": "Electronics",
  "stock": 50
}
```

### Validation Rules:
* `name`: Required string. Cannot be empty.
* `price`: Required number. Must be greater than or equal to 0.
* `stock`: Optional number. Cannot be negative (min: 0). Default is 0.
* `category`: Optional string. Default is `"General"`.
* `description`: Optional string. Default is `""`.

### Responses:
* **201 Created (Success):**
```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": "6ab549a1cd8f9abe5018e7b1",
    "name": "Wireless Noise-Canceling Headphones",
    "price": 199.99,
    "description": "Premium over-ear wireless headphones with active noise cancellation.",
    "category": "Electronics",
    "stock": 50,
    "createdAt": "2026-09-24T16:02:41.903Z",
    "updatedAt": "2026-09-24T16:02:41.904Z"
  }
}
```

* **400 Bad Request (Validation Error - Missing Name):**
```json
{
  "success": false,
  "message": "Product name is required"
}
```

* **400 Bad Request (Validation Error - Invalid/Negative Price):**
```json
{
  "success": false,
  "message": "Price must be a valid positive number"
}
```

---

## 2. Update Product by ID

* **Description:** Updates fields of an existing product specified by MongoDB ObjectId.
* **HTTP Method:** `PUT` / `PATCH`
* **Endpoint:** `/api/products/:id` (alias: `/products/:id`, `/api/products/update/:id`)
* **Headers:** `Content-Type: application/json`

### Request Parameters:
* `:id` (MongoDB ObjectId, e.g. `6ab549a1cd8f9abe5018e7b1`)

### Request Body (partial or full update):
```json
{
  "price": 179.99,
  "stock": 45,
  "description": "Updated premium over-ear headphones with 40-hour battery life."
}
```

### Responses:
* **200 OK (Success):**
```json
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": "6ab549a1cd8f9abe5018e7b1",
    "name": "Wireless Noise-Canceling Headphones",
    "price": 179.99,
    "description": "Updated premium over-ear headphones with 40-hour battery life.",
    "category": "Electronics",
    "stock": 45,
    "createdAt": "2026-09-24T16:02:41.903Z",
    "updatedAt": "2026-09-24T16:02:42.813Z"
  }
}
```

* **400 Bad Request (Invalid input value):**
```json
{
  "success": false,
  "message": "Price must be a valid positive number"
}
```

* **404 Not Found (Product ID does not exist):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 3. Get All Products

* **HTTP Method:** `GET`
* **Endpoint:** `/api/products` (alias: `/products`)
* **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "6ab549a1cd8f9abe5018e7b1",
      "name": "Wireless Noise-Canceling Headphones",
      "price": 179.99,
      "description": "Updated premium over-ear headphones.",
      "category": "Electronics",
      "stock": 45,
      "createdAt": "2026-09-24T16:02:41.903Z",
      "updatedAt": "2026-09-24T16:02:42.813Z"
    }
  ]
}
```

---

## 4. Get Product by ID

* **HTTP Method:** `GET`
* **Endpoint:** `/api/products/:id` (alias: `/products/:id`)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "6ab549a1cd8f9abe5018e7b1",
    "name": "Wireless Noise-Canceling Headphones",
    "price": 179.99,
    "description": "Updated premium over-ear headphones.",
    "category": "Electronics",
    "stock": 45,
    "createdAt": "2026-09-24T16:02:41.903Z",
    "updatedAt": "2026-09-24T16:02:42.813Z"
  }
}
```

---

## 5. Delete Product by ID

* **HTTP Method:** `DELETE`
* **Endpoint:** `/api/products/:id` (alias: `/products/:id`)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully."
}
```

---

## 💻 Implementation Source Code

### `controllers/productController.js`
```javascript
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    if (price === undefined || price === null || typeof price !== 'number' || isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Price must be a valid positive number" });
    }

    if (stock !== undefined && (typeof stock !== 'number' || isNaN(stock) || stock < 0)) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
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

// Update Product by ID
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { name, price, description, category, stock } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ success: false, message: "Product name cannot be empty" });
    }

    if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
      return res.status(400).json({ success: false, message: "Price must be a valid positive number" });
    }

    if (stock !== undefined && (typeof stock !== 'number' || isNaN(stock) || stock < 0)) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
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
      return res.status(404).json({ success: false, message: "Product not found" });
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

module.exports = {
  createProduct,
  updateProductById
};
```
