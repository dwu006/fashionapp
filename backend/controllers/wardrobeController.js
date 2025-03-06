/*
    CRUD functions for wardrobe items
*/

import WardrobeItem from '../models/WardrobeItem.js';

const wardrobeController = {

    createWardrobeItem: async (req, res) => {
        try {
            console.log('Received upload request');
            console.log('Request body:', req.body);
            console.log('File:', req.file);

            if (!req.file) {
                return res.status(400).json({ 
                    error: 'no image uploaded'
                });
            }

            const category = req.body.category;
            console.log('Processing category from form data:', category);

            if (!category) {
                return res.status(400).json({
                    error: 'category is required'
                });
            }

            // Validate category
            const validCategories = ['top', 'bottom', 'outerwear', 'accessories', 'shoes', 'other'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    error: 'invalid category'
                });
            }

            // Get user ID from the authenticated request
            const userId = req.user._id;

            const wardrobeItem = new WardrobeItem({
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                },
                category: category,
                user: userId
            });

            console.log('Saving wardrobe item:', {
                category: wardrobeItem.category,
                userId: wardrobeItem.user
            });

            const savedItem = await wardrobeItem.save();
            console.log('Successfully saved item with category:', savedItem.category);

            res.status(200).json({ 
                message: 'Upload successful',
                item: {
                    id: savedItem._id,
                    category: savedItem.category
                }
            });
        } catch (err) {
            console.error('Error in createWardrobeItem:', err);
            res.status(400).json({ 
                error: 'Upload failed', 
                details: err.message,
                validationError: err.errors?.category?.message
            });
        }
    },

    getAllWardrobeItems: async (req, res) => {
        try {
            // Get user ID from the authenticated request
            const userId = req.user._id;
            
            // Only return items for the current user
            const items = await WardrobeItem.find({ user: userId });
            
            console.log('Found items:', items.length);
            // Log the structure of the first item if it exists
            if (items.length > 0) {
                console.log('First item structure:', {
                    id: items[0]._id,
                    category: items[0].category,
                    hasImage: !!items[0].image,
                    imageContentType: items[0].image?.contentType,
                    imageDataLength: items[0].image?.data?.length
                });
            }

            res.status(200).json(items);
        } catch (err) {
            console.error('Error in getAllWardrobeItems:', err);
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