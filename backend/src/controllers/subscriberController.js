// backend/controllers/subscriberController.js

import {
    addSubscriberService,
    getSubscribersService,
    deleteSubscriberService,
  } from '../services/subscriberService.js';
  
  // Controller to fetch all subscribers
  export const getSubscribers = async (req, res) => {
    try {
      const subscribers = await getSubscribersService();
      res.status(200).json(subscribers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch subscribers.' });
    }
  };
  
  // Controller to add a new subscriber
  export const addSubscriber = async (req, res) => {
    const { walletAddress, name } = req.body;
    try {
      const newSubscriber = await addSubscriberService({ walletAddress, name });
      res.status(201).json(newSubscriber);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add subscriber.' });
    }
  };
  
  // Controller to delete a subscriber
  export const deleteSubscriber = async (req, res) => {
    const { id } = req.params;
    try {
      await deleteSubscriberService(id);
      res.status(200).json({ message: 'Subscriber deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete subscriber.' });
    }
  };
  