/*
    User authentication and CRUD functions
*/
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import path from 'path';

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
                    token: generateToken(user._id),
                    hasProfilePicture: !!user.profilePicturePath
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
                email: user.email,
                hasProfilePicture: !!user.profilePicturePath
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
    },

    // Logout user
    logoutUser: async (req, res) => {
        try {
            // In a real-world scenario, you might want to invalidate the token on the server-side
            // For now, we'll handle logout on the client-side by removing the token
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout', error: error.message });
        }
    },

    // upload profile picture
    uploadProfilePicture: async (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).json({ error: 'no image' });
          }
          
          const userId = req.user._id;
          
          // update with file path
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicturePath: req.file.path },
            { new: true }
          ).select('-password');
          
          if (!updatedUser) {
            return res.status(404).json({ error: 'user not found' });
          }
          
          res.status(200).json({ 
            message: 'pfp uploaded successfully',
            hasProfilePicture: true
          });
        } catch (err) {
          res.status(500).json({ error: 'uploading error' });
        }
      },

    // get profile picture
    getProfilePicture: async (req, res) => {
        try {
          const userId = req.params.id || req.user?._id;
          console.log("getProfilePicture called for user:", userId); // <-- Logging added
      
          const user = await User.findById(userId);
          if (!user) {
            console.log("User not found:", userId);
            return res.status(404).json({ error: 'user not found' });
          }
          
          if (!user.profilePicturePath) {
            console.log("No profilePicturePath for user:", userId);
            return res.status(404).json({ error: 'pfp not found' });
          }
          
          const resolvedPath = path.resolve(user.profilePicturePath);
          console.log("Serving file from:", resolvedPath); // <-- Logging added
      
          res.sendFile(resolvedPath);
        } catch (err) {
          console.error("Error in getProfilePicture:", err);
          res.status(500).json({ error: 'error retrieving pfp' });
        }
      }
};

export default userController;