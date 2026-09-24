const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userController');

// Create User (supports standard REST and legacy alias)
router.post('/', createUser);
router.post('/add-user', createUser);

// Get All Users
router.get('/', getAllUsers);

// Get User by ID
router.get('/:id', getUserById);

// Update User by ID
router.put('/:id', updateUserById);
router.patch('/:id', updateUserById);

// Delete User by ID
router.delete('/:id', deleteUserById);

module.exports = router;
