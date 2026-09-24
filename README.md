# User & Product REST API (Node.js + Express + MongoDB)

A lightweight and robust REST API built with Node.js, Express, and Mongoose to create and manage users and products.

## 🚀 Getting Started

### 1. Run the Server
```bash
npm start
# or
node server.js
```
The server will start at `http://localhost:3000`.

### 2. Run Automated Verification Tests
```bash
node test.js
```

---

## 📌 API Endpoints

### 📦 Product Endpoints

#### 1. Create Product
- **Method:** `POST`
- **URL:** `/api/products` (alias: `/products`, `/api/products/add-product`)
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Wireless Noise-Canceling Headphones",
  "price": 199.99,
  "description": "Premium over-ear wireless headphones.",
  "category": "Electronics",
  "stock": 50
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": "6ab549565fc907716d0070bb",
    "name": "Wireless Noise-Canceling Headphones",
    "price": 199.99,
    "description": "Premium over-ear wireless headphones.",
    "category": "Electronics",
    "stock": 50,
    "createdAt": "2026-09-24T16:01:26.496Z",
    "updatedAt": "2026-09-24T16:01:26.497Z"
  }
}
```

#### 2. Update Product by ID
- **Method:** `PUT` / `PATCH`
- **URL:** `/api/products/:id` (alias: `/products/:id`, `/api/products/update/:id`)
- **Headers:** `Content-Type: application/json`
- **Body (partial or full):**
```json
{
  "price": 179.99,
  "stock": 45,
  "description": "Updated premium over-ear headphones."
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": "6ab549565fc907716d0070bb",
    "name": "Wireless Noise-Canceling Headphones",
    "price": 179.99,
    "description": "Updated premium over-ear headphones.",
    "category": "Electronics",
    "stock": 45,
    "updatedAt": "2026-09-24T16:01:27.749Z"
  }
}
```

#### 3. Get All Products
- **Method:** `GET`
- **URL:** `/api/products` (alias: `/products`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

#### 4. Get Product by ID
- **Method:** `GET`
- **URL:** `/api/products/:id` (alias: `/products/:id`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": { ... }
}
```

#### 5. Delete Product by ID
- **Method:** `DELETE`
- **URL:** `/api/products/:id` (alias: `/products/:id`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Product deleted successfully."
}
```

---

### 👤 User Endpoints

#### 1. Create User
- **Method:** `POST`
- **URL:** `/api/users` (alias: `/users`, `/api/users/add-user`)
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "admin"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": "6ab549555fc907716d0070b8",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "admin",
    "createdAt": "2026-09-24T16:01:25.954Z"
  }
}
```

#### 2. Get All Users
- **Method:** `GET`
- **URL:** `/api/users` (alias: `/users`)

#### 3. Get User by ID
- **Method:** `GET`
- **URL:** `/api/users/:id` (alias: `/users/:id`)

#### 4. Update User by ID
- **Method:** `PUT` / `PATCH`
- **URL:** `/api/users/:id`

#### 5. Delete User by ID
- **Method:** `DELETE`
- **URL:** `/api/users/:id`
