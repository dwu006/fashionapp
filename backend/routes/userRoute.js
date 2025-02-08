import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

// CREATE: Add a new user
userRouter.post('/', userController.createUser);

// READ: Get all users
userRouter.get('/', userController.getAllUsers);

// READ: Get a specific user by ID
userRouter.get('/:id', userController.getUserById);

// UPDATE: Update a user by ID
userRouter.put('/:id', userController.updateUser);

// DELETE: Remove a user by ID
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
