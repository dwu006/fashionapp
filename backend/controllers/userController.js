/*
    CRUD functions for user
*/


import User from '../models/User.js';

const userController = {
    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'user not found' });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateUser: async (req, res) => {
        try { 
            const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
            );
            if (!updatedUser) return res.status(404).json({ error: 'user not found' });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ error: 'user not found' });
            res.status(200).json({ message: 'user deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default userController;