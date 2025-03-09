import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const userRouter = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit
    }
});

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

// Profile picture routes
userRouter.post('/profile-picture', protect, upload.single('profilePicture'), userController.uploadProfilePicture);
userRouter.get('/profile-picture', protect, userController.getProfilePicture);
userRouter.get('/profile-picture/:id', protect, userController.getProfilePicture);

export default userRouter;
