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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;
