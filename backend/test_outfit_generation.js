import { generateOutfit } from './api/g.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WardrobeItem from './models/WardrobeItem.js';

dotenv.config();

async function findUserWithWardrobeItems() {
    const item = await WardrobeItem.findOne();
    if (!item) {
        throw new Error('No wardrobe items found in database');
    }
    return item.user;
}

async function testOutfitGeneration() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashionapp';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a user with wardrobe items
        const userId = await findUserWithWardrobeItems();
        console.log('Found user with wardrobe items:', userId);

        // Los Angeles coordinates
        const lat = 34.0522;
        const lon = -118.2437;

        // Test the generateOutfit function
        console.log('Testing outfit generation...');
        console.log('Location:', lat, lon);
        
        const result = await generateOutfit(
            userId,
            'casual outfit for a sunny day',
            lat,
            lon
        );

        console.log('\nGenerated Outfit:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

// Run the test
testOutfitGeneration();
