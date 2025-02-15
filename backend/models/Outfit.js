import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    visibility: {
        type: Boolean,
        default: false
    },
    caption: {
        type: String,
        default: ""
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;
