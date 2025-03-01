import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateOutfit } from '../api/g.js';

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

export default router;
