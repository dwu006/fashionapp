import express from 'express';
import multer from 'multer';
import outfitController from '../controllers/outfitController.js';
import { protect } from '../middleware/auth.js';

const outfitRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are protected and require authentication
outfitRouter.use(protect);

// Routes
outfitRouter.post('/upload', upload.single('image'), outfitController.createOutfit);
outfitRouter.get('/', outfitController.getAllOutfits);
outfitRouter.get('/:id', outfitController.getOutfitById);
outfitRouter.put('/:id', upload.single('image'), outfitController.updateOutfit);
outfitRouter.delete('/:id', outfitController.deleteOutfit);
outfitRouter.post('/:id/toggle-visibility', outfitController.toggleVisibility);
outfitRouter.post('/:id/like', outfitController.toggleLike);
outfitRouter.post('/:id/comment', outfitController.addComment);

export default outfitRouter;
