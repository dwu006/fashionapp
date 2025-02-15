import express from 'express';
import wardrobeController from '../controllers/wardrobeController.js';
import upload from '../middleware/upload.js';

const wardrobeRouter = express.Router();
<<<<<<< HEAD

// CREATE: Add a new wardrobe item with image
wardrobeRouter.post('/', upload.single('image'), wardrobeController.createWardrobeItem);

// READ: Get all wardrobe items (
=======
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

wardrobeRouter.use(protect);
wardrobeRouter.post('/upload', upload.single('image'), wardrobeController.createWardrobeItem);
>>>>>>> 28db1a7 (minor fixes)
wardrobeRouter.get('/', wardrobeController.getAllWardrobeItems);
wardrobeRouter.get('/:id', wardrobeController.getWardrobeItemById);
<<<<<<< HEAD

// UPDATE: Update a wardrobe item by ID
wardrobeRouter.put('/:id', upload.single('image'), wardrobeController.updateWardrobeItem);

// DELETE: Remove a wardrobe item by ID
=======
wardrobeRouter.put('/:id', wardrobeController.updateWardrobeItem);
>>>>>>> 28db1a7 (minor fixes)
wardrobeRouter.delete('/:id', wardrobeController.deleteWardrobeItem);

export default wardrobeRouter;
