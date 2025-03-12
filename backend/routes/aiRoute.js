import express from 'express';
import multer from 'multer';
import aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = path.resolve(__dirname, '..');

const aiRouter = express.Router();

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
aiRouter.post('/analyze_image', upload.single('image'), aiController.analyzeClothing);

export default aiRouter;

