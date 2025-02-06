import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  imageURL: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  style: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

export default WardrobeItem;