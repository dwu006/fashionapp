import User from '../models/User.js';

const userController = {
    // Create a new user
    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a single user by ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update a user by ID
    updateUser: async (req, res) => {
        try { 
            const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
            );
            if (!updatedUser) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete a user by ID
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ error: 'User not found' });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default userController;