import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  category: {
    type: String,
    required: true,
    enum: ['top', 'bottom', 'outerwear', 'accessories', 'shoes', 'other']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

export default WardrobeItem;