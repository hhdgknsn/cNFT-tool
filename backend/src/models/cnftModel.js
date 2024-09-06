// backend/models/cnftModel.js
import mongoose from 'mongoose';

// Define the schema for a cNFT
const cnftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  sellerFee: {
    type: Number, // Represents the fee percentage as a whole number (e.g., 5 for 5%)
    required: true,
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection', // Reference to the Collection model
    required: true,
  },
  mintAddress: {
    type: String,
    unique: true, // Each cNFT should have a unique mint address
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the cNFT schema
const Cnft = mongoose.model('Cnft', cnftSchema);

export default Cnft;
