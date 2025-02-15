import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.loginUser);
userRouter.post('/logout', userController.logoutUser);

// Protected routes
userRouter.get('/profile', protect, userController.getProfile);
userRouter.get('/', protect, userController.getAllUsers);
userRouter.get('/:id', protect, userController.getUserById);
userRouter.put('/:id', protect, userController.updateUser);
userRouter.delete('/:id', protect, userController.deleteUser);

export default userRouter;
