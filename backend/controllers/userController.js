/*
    User authentication and CRUD functions
*/
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

const userController = {
    // Register new user
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user with hashed password
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                });
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Login user
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            
            // Check if user exists and password matches
            if (user && (await bcrypt.compare(password, user.password))) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get user profile (protected route)
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { password, ...otherFields } = req.body;
            let updateData = { ...otherFields };

            // If password is being updated, hash it
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).select('-password');

            if (!updatedUser) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

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