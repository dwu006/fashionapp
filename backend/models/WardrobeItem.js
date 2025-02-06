import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  imageURL: {
    type: String,
  },
  category: {
    type: String
  },
  style: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

export default WardrobeItem;