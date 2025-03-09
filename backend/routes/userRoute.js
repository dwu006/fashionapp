import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const userRouter = express.Router();

// multer disk storage now
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'uploads/';
      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Create a unique filename using Date.now()
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5mb limit
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
userRouter.get('/profile-picture',  userController.getProfilePicture);
userRouter.get('/profile-picture/:id',  userController.getProfilePicture);

export default userRouter;
