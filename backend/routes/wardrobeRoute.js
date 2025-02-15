import express from 'express';
import multer from 'multer';
import wardrobeController from '../controllers/wardrobeController.js';
import { protect } from '../middleware/auth.js';

const wardrobeRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

wardrobeRouter.use(protect);
wardrobeRouter.post('/upload', upload.single('image'), wardrobeController.createWardrobeItem);
wardrobeRouter.get('/', wardrobeController.getAllWardrobeItems);
wardrobeRouter.get('/:id', wardrobeController.getWardrobeItemById);
wardrobeRouter.put('/:id', wardrobeController.updateWardrobeItem);
wardrobeRouter.delete('/:id', wardrobeController.deleteWardrobeItem);

export default wardrobeRouter;
