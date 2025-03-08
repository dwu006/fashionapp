import express from 'express';
import multer from 'multer';
import aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const aiRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = express.Router();

router.post('/generate-outfit', protect, async (req, res) => {
    try {
        const { prompt, lat, lon } = req.body;
        const userId = req.user._id;

        if (!prompt || !lat || !lon) {
            return res.status(400).json({ 
                message: 'Please provide prompt, latitude, and longitude' 
            });
        }

        const outfitData = await generateOutfit(userId, prompt, lat, lon);
        res.json(outfitData);
    } catch (error) {
        console.error('Error generating outfit:', error);
        res.status(500).json({ 
            message: 'Error generating outfit', 
            error: error.message 
        });
    }
});

// All routes are protected and require authentication
aiRouter.use(protect);

// Routes
aiRouter.post('/', aiController.respondToPrompt);
aiRouter.post('/image_idea', aiController.createClothing);
aiRouter.post('/analyze_image', aiController.analyzeClothing);

export default aiRouter;

