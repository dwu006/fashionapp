import WardrobeItem from '../models/WardrobeItem.js';

const wardrobeController = {
    // Create a new wardrobe item
    createWardrobeItem: async (req, res) => {
    try {
        const item = await WardrobeItem.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    },

    // Get all wardrobe items (you can filter by user by passing a query parameter, e.g., ?user=USER_ID)
    getAllWardrobeItems: async (req, res) => {
    try {
        const filter = req.query.user ? { user: req.query.user } : {};
        const items = await WardrobeItem.find(filter);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },

    // Get a single wardrobe item by ID
    getWardrobeItemById: async (req, res) => {
    try {
        const item = await WardrobeItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },

    // Update a wardrobe item by ID
    updateWardrobeItem: async (req, res) => {  
    try {
        const updatedItem = await WardrobeItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    },

    // Delete a wardrobe item by ID
    deleteWardrobeItem: async (req, res) => {
    try {
        const deletedItem = await WardrobeItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }

};

export default wardrobeController;