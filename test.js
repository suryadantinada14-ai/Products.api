const http = require('http');
const mongoose = require('mongoose');
const app = require('./server');

// Wait for database connection
async function waitForDB(timeoutMs = 15000) {
  const startTime = Date.now();
  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Timed out waiting for MongoDB connection in test');
    }
    await new Promise((res) => setTimeout(res, 200));
  }
}

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running on port ${port}`);

  async function request(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const body = await res.json();
    return { status: res.status, body };
  }

  try {
    console.log('Connecting to database...');
    await waitForDB();
    console.log('Database ready. Cleaning test data...');

    const User = require('./models/User');
    const Product = require('./models/Product');

    // Clean up previous test runs if any
    await User.deleteMany({ email: 'alice@example.com' });
    await Product.deleteMany({ name: 'Wireless Noise-Canceling Headphones' });

    // 1. Test POST /api/users - Success
    console.log('\n1. Testing POST /api/users...');
    const userRes = await request('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin'
      })
    });
    console.log('Status:', userRes.status, 'Body:', userRes.body);
    if (userRes.status !== 201 || !userRes.body.success) throw new Error('Create user failed');

    // 2. Test POST /api/users - Duplicate email validation
    console.log('\n2. Testing duplicate email rejection...');
    const dupRes = await request('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alice Dup',
        email: 'alice@example.com'
      })
    });
    console.log('Status:', dupRes.status, 'Body:', dupRes.body);
    if (dupRes.status !== 409) throw new Error('Expected 409 Conflict for duplicate email');

    // 3. Test POST /api/products - Success (Create product)
    console.log('\n3. Testing POST /api/products (Create product)...');
    const productRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Wireless Noise-Canceling Headphones',
        price: 199.99,
        description: 'Premium over-ear wireless headphones with active noise cancellation.',
        category: 'Electronics',
        stock: 50
      })
    });
    console.log('Status:', productRes.status, 'Body:', productRes.body);
    if (productRes.status !== 201 || !productRes.body.success) throw new Error('Create product failed');

    const createdProductId = productRes.body.data._id || productRes.body.data.id;
    console.log('Created Product ID:', createdProductId);

    // 4. Test POST /api/products - Validation failure (invalid price)
    console.log('\n4. Testing product validation failure...');
    const badProductRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Invalid Item',
        price: -10
      })
    });
    console.log('Status:', badProductRes.status, 'Body:', badProductRes.body);
    if (badProductRes.status !== 400) throw new Error('Expected 400 Bad Request for negative price');

    // 5. Test GET /api/users and GET /api/products
    console.log('\n5. Testing GET /api/users...');
    const listUsers = await request('/api/users');
    console.log('Users count:', listUsers.body.count);
    if (listUsers.status !== 200 || !listUsers.body.success) throw new Error('Get users failed');

    console.log('\n6. Testing GET /api/products...');
    const listProducts = await request('/api/products');
    console.log('Products count:', listProducts.body.count);
    if (listProducts.status !== 200 || !listProducts.body.success) throw new Error('Get products failed');

    // 7. Test PUT /api/products/:id - Update product by ID
    console.log('\n7. Testing PUT /api/products/:id (Update product by ID)...');
    const updateRes = await request(`/api/products/${createdProductId}`, {
      method: 'PUT',
      body: JSON.stringify({
        price: 179.99,
        stock: 45,
        description: 'Updated premium over-ear headphones.'
      })
    });
    console.log('Status:', updateRes.status, 'Body:', updateRes.body);
    if (
      updateRes.status !== 200 ||
      !updateRes.body.success ||
      updateRes.body.data.price !== 179.99 ||
      updateRes.body.data.stock !== 45
    ) {
      throw new Error('Update product by ID failed');
    }

    // 8. Test PUT /api/products/:id - Validation on negative price during update
    console.log('\n8. Testing PUT /api/products/:id with invalid negative price...');
    const badUpdateRes = await request(`/api/products/${createdProductId}`, {
      method: 'PUT',
      body: JSON.stringify({
        price: -50
      })
    });
    console.log('Status:', badUpdateRes.status, 'Body:', badUpdateRes.body);
    if (badUpdateRes.status !== 400) throw new Error('Expected 400 Bad Request for negative price on update');

    // 9. Test GET /api/products/:id - Get product by ID
    console.log('\n9. Testing GET /api/products/:id (Get product by ID)...');
    const getByIdRes = await request(`/api/products/${createdProductId}`);
    console.log('Status:', getByIdRes.status, 'Body:', getByIdRes.body);
    if (getByIdRes.status !== 200 || !getByIdRes.body.success || getByIdRes.body.data.price !== 179.99) {
      throw new Error('Get product by ID failed');
    }

    console.log('\n🎉 All tests passed successfully!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.disconnect();
  }
});
