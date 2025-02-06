import express from 'express';
import wardrobeController from '../controllers/wardrobeController.js';

const router = express.Router();
// CREATE: Add a new wardrobe item
router.post('/', wardrobeController.createWardrobeItem);

// READ: Get all wardrobe items (optionally filter by query, e.g., ?user=USER_ID)
router.get('/', wardrobeController.getAllWardrobeItems);

// READ: Get a specific wardrobe item by ID
router.get('/:id', wardrobeController.getWardrobeItemById);

// UPDATE: Update a wardrobe item by ID
router.put('/:id', wardrobeController.updateWardrobeItem);

// DELETE: Remove a wardrobe item by ID
router.delete('/:id', wardrobeController.deleteWardrobeItem);

export default router;
