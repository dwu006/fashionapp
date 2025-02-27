import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/donation-centers', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                location: `${lat},${lng}`,
                radius: 8047, // 5 miles in meters
                keyword: 'clothing donation thrift store goodwill salvation army',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        const results = response.data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
            phone: place.formatted_phone_number || 'N/A',
            rating: place.rating || 'No rating',
            place_id: place.place_id
        }));

        res.json(results);
    } catch (error) {
        console.error('Error fetching donation centers:', error);
        res.status(500).json({ error: 'Failed to fetch donation centers' });
    }
});

export default router;
