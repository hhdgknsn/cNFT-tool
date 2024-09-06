import express from 'express';
import {
  getSubscribers,
  addSubscriber,
  deleteSubscriber,
} from '../controllers/subscriberController.js'; // Import the controller functions

const router = express.Router();

// Get all subscribers
router.get('/', getSubscribers);

// Add a new subscriber
router.post('/add', addSubscriber);

// Delete a subscriber
router.delete('/:id', deleteSubscriber);

export default router;