import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  category: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

export default WardrobeItem;