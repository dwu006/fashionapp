import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = path.resolve(__dirname, '..');

const userRouter = express.Router();

// Create the 'uploads/' folder inside 'backend' directory if it doesn't exist
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure the path points to 'backend/uploads/'
    const uploadDir = path.resolve(parentDir, 'uploads');
    console.log("Upload Directory: ", uploadDir); // Log to check the full path

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Pass the correct directory to Multer
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    console.log("Saving file as: ", filename); // Log filename to check
    cb(null, filename); // Set the file name
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
}); // 5mb limit

userRouter.use('/uploads', express.static('uploads'));

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
userRouter.get('/profile-picture', userController.getProfilePicture);
userRouter.get('/profile-picture/:id', userController.getProfilePicture);

// Error handling for multer
userRouter.post('/profile-picture', protect, (req, res, next) => {
  upload.single('profilePicture')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      // Other errors (e.g., general server error)
      return res.status(500).json({ error: 'Error uploading file: ' + err.message });
    }
    next();
  });
}, userController.uploadProfilePicture);


export default userRouter;
