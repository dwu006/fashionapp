/*
    CRUD functions for wardrobe items
*/

import WardrobeItem from '../models/WardrobeItem.js';

const wardrobeController = {

    createWardrobeItem: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'no image uploaded'
                });
            }
    
            const userId = req.user._id;
    
            const wardrobeItem = new WardrobeItem({
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                },
                category: req.body.category, // Add category from form data
                user: userId
            });
    
            await wardrobeItem.save();
            res.status(200).json({ message: 'Upload successful' });
        } catch (err) {
            console.error('error', err);
            res.status(400).json({ error: 'Upload failed' });
        }
    },

    getAllWardrobeItems: async (req, res) => {
        try {
            // Get user ID from the authenticated request
            const userId = req.user._id;
            
            // Only return items for the current user
            const items = await WardrobeItem.find({ user: userId });
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getWardrobeItemById: async (req, res) => {
        try {
            const item = await WardrobeItem.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            // Check if the item belongs to the current user
            if (item.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to view this item' });
            }

            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateWardrobeItem: async (req, res) => {
        try {
            const item = await WardrobeItem.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            // Check if the item belongs to the current user
            if (item.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to update this item' });
            }

            const updatedItem = await WardrobeItem.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            res.status(200).json(updatedItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteWardrobeItem: async (req, res) => {
        try {
            const item = await WardrobeItem.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            // Check if the item belongs to the current user
            if (item.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to delete this item' });
            }

            await WardrobeItem.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default wardrobeController;