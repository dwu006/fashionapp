import express from 'express';
import multer from 'multer';
import aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const aiRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are protected and require authentication
aiRouter.use(protect);

// Routes
aiRouter.post('/', aiController.respondToPrompt);
aiRouter.post('/image_idea', aiController.createClothing);
aiRouter.post('/analyze_image', aiController.analyzeClothing);

export default aiRouter;
