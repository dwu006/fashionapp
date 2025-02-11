import express from 'express';
import wardrobeController from '../controllers/wardrobeController.js';
import upload from '../middleware/upload.js';

const wardrobeRouter = express.Router();

// CREATE: Add a new wardrobe item with image
wardrobeRouter.post('/', upload.single('image'), wardrobeController.createWardrobeItem);

// READ: Get all wardrobe items (
wardrobeRouter.get('/', wardrobeController.getAllWardrobeItems);

// READ: Get a specific wardrobe item by ID
wardrobeRouter.get('/:id', wardrobeController.getWardrobeItemById);

// UPDATE: Update a wardrobe item by ID
wardrobeRouter.put('/:id', upload.single('image'), wardrobeController.updateWardrobeItem);

// DELETE: Remove a wardrobe item by ID
wardrobeRouter.delete('/:id', wardrobeController.deleteWardrobeItem);

export default wardrobeRouter;
