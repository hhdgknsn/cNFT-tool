import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
}, { timestamps: true });

const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);
export default SubscriberModel;