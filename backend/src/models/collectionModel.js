import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Add any other fields relevant to your collection
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection; // Ensure default export