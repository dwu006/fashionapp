import Outfit from '../models/Outfit.js';

const outfitController = {
    // Create a new outfit
    createOutfit: async (req, res) => {
        try {
            const outfit = new Outfit({
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                },
                user: req.user._id,
                likes: req.body.likes || [],
                tags: req.body.tags || [],
                caption: req.body.caption || "",
                comments: req.body.comments || [],
                visibility: req.body.visibility || false 
            });

            await outfit.save();
            res.status(201).json({ message: 'Outfit created successfully', outfit });
        } catch (error) {
            res.status(500).json({ message: 'Error creating outfit', error: error.message });
        }
    },

    // Get all outfits (with optional user filter)
    getAllOutfits: async (req, res) => {
        try {
            let filter = {};
            const userId = req.user._id;
            
            if (req.query.userId) {
                // If looking at specific user's outfits
                if (req.query.userId === userId.toString()) {
                    // User viewing their own outfits - show all
                    filter.user = req.query.userId;
                } else {
                    // Viewing other user's outfits - only show public
                    filter = {
                        user: req.query.userId,
                        visibility: true
                    };
                }
            } else {
                // Viewing all outfits - only show public ones
                filter.visibility = true;
            }

            const outfits = await Outfit.find(filter)
                .populate('user', 'username profileImage')
                .populate('comments.user', 'username profileImage')
                .sort({ createdAt: -1 });

            // Transform outfits to include user-specific like status
            const safeOutfits = outfits.map(outfit => {
                const outfitObj = outfit.toObject();
                outfitObj.likes = Array.isArray(outfitObj.likes) ? outfitObj.likes : [];
                outfitObj.userHasLiked = outfitObj.likes.some(id => id.toString() === userId.toString());
                outfitObj.likesCount = outfitObj.likes.length;
                return outfitObj;
            });

            res.json({ outfits: safeOutfits });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching outfits', error: error.message });
        }
    },

    // Get a specific outfit by ID
    getOutfitById: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id)
                .populate('user', 'username');
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if user has permission to view this outfit
            if (!outfit.visibility && outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this outfit' });
            }
            
            res.json(outfit);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching outfit', error: error.message });
        }
    },

    // Update an outfit
    updateOutfit: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id);
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if user owns the outfit
            if (outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this outfit' });
            }

            const updates = {
                tags: req.body.tags,
                visibility: req.body.visibility !== undefined ? req.body.visibility : outfit.visibility,
                ...(req.file && {
                    image: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype
                    }
                })
            };

            const updatedOutfit = await Outfit.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true }
            );

            res.json(updatedOutfit);
        } catch (error) {
            res.status(500).json({ message: 'Error updating outfit', error: error.message });
        }
    },

    // Toggle outfit visibility
    toggleVisibility: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id);
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if user owns the outfit
            if (outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this outfit' });
            }

            outfit.visibility = !outfit.visibility;
            await outfit.save();
            
            res.json({ 
                message: `Outfit is now ${outfit.visibility ? 'public' : 'private'}`,
                visibility: outfit.visibility 
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating outfit visibility', error: error.message });
        }
    },

    // Delete an outfit
    deleteOutfit: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id);
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if user owns the outfit
            if (outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this outfit' });
            }

            await outfit.deleteOne();
            res.json({ message: 'Outfit deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting outfit', error: error.message });
        }
    },

    // Like/Unlike an outfit
    toggleLike: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id);
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if outfit is public or owned by user
            if (!outfit.visibility && outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to like this outfit' });
            }

            const userId = req.user._id;
            console.log("outfit likes before liking: ", outfit.likes);
            if (!outfit.likes) {
                outfit.likes = [];
            }
            const userLikeIndex = outfit.likes.findIndex(id => id.toString() === userId.toString());

            if (userLikeIndex === -1) {
                // User hasn't liked the post yet, add their like
                outfit.likes.push(userId);
            } else {
                // User already liked the post, remove their like
                outfit.likes.splice(userLikeIndex, 1);
            }

            await outfit.save();
            
            // Return the updated likes array and whether the user has liked the post
            res.json({ 
                message: userLikeIndex === -1 ? 'Outfit liked successfully' : 'Outfit unliked successfully',
                likes: outfit.likes,
                userHasLiked: userLikeIndex === -1,
                likesCount: outfit.likes.length
            });
        } catch (error) {
            console.log("Error while liking: ", error);
            res.status(500).json({ message: 'Error toggling like', error: error.message });
        }
    },

    // Add a comment to an outfit
    addComment: async (req, res) => {
        try {
            const outfit = await Outfit.findById(req.params.id);
            
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Check if outfit is public or owned by user
            if (!outfit.visibility && outfit.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to comment on this outfit' });
            }

            const newComment = {
                user: req.user._id,
                content: req.body.content
            };

            outfit.comments.push(newComment);
            await outfit.save();

            // Populate the user info for the new comment
            const populatedOutfit = await Outfit.findById(outfit._id)
                .populate('comments.user', 'username profileImage');

            const addedComment = populatedOutfit.comments[populatedOutfit.comments.length - 1];

            res.json({
                message: 'Comment added successfully',
                comment: addedComment
            });
        } catch (error) {
            console.log("Detailed error during adding, ", error);
            res.status(500).json({ message: 'Error adding comment', error: error.message });
        }
    }
};

export default outfitController;
