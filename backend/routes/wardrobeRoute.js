import express from 'express';
import multer from 'multer';
import wardrobeController from '../controllers/wardrobeController.js';
import { protect } from '../middleware/auth.js';

const wardrobeRouter = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are protected and require authentication
wardrobeRouter.use(protect);

// CREATE: Add a new wardrobe item with image
wardrobeRouter.post('/upload', upload.single('image'), wardrobeController.createWardrobeItem);

// READ: Get all wardrobe items
wardrobeRouter.get('/', wardrobeController.getAllWardrobeItems);

// READ: Get a specific wardrobe item by ID
wardrobeRouter.get('/:id', wardrobeController.getWardrobeItemById);

// UPDATE: Update a wardrobe item by ID
wardrobeRouter.put('/:id', wardrobeController.updateWardrobeItem);

// DELETE: Remove a wardrobe item by ID
wardrobeRouter.delete('/:id', wardrobeController.deleteWardrobeItem);

export default wardrobeRouter;
