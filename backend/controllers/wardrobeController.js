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
            const wardrobeItem = new WardrobeItem({
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });

            await wardrobeItem.save();
            res.status(201).json({ 
                id: wardrobeItem._id,
                imageDetails: {
                    contentType: req.file.mimetype,
                    size: req.file.size
                }
            });
        } catch (err) {
            console.error('error', err);
            res.status(400).json({ error: err.message });
        }
    },

    getAllWardrobeItems: async (req, res) => {
        try {
            const filter = req.query.user ? { user: req.query.user } : {};
            const items = await WardrobeItem.find(filter);
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getWardrobeItemById: async (req, res) => {
        try {
            const item = await WardrobeItem.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'not found' });
            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateWardrobeItem: async (req, res) => {  
        try {
            const updatedItem = await WardrobeItem.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedItem) return res.status(404).json({ error: 'not found' });
            res.status(200).json(updatedItem);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    deleteWardrobeItem: async (req, res) => {
        try {
            const deletedItem = await WardrobeItem.findByIdAndDelete(req.params.id);
            if (!deletedItem) return res.status(404).json({ error: 'not found' });
            res.status(200).json({ message: 'Ideleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default wardrobeController;