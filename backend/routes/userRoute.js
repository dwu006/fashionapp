import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// CREATE: Add a new user
router.post('/', userController.createUser);

// READ: Get all users
router.get('/', userController.getAllUsers);

// READ: Get a specific user by ID
router.get('/:id', userController.getUserById);

// UPDATE: Update a user by ID
router.put('/:id', userController.updateUser);

// DELETE: Remove a user by ID
router.delete('/:id', userController.deleteUser);

export default router;
