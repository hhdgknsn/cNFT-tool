// backend/services/subscriberService.js
import fs from 'fs';
import path from 'path';
import { readJsonFile, writeJsonFile } from '../utils/jsonHelper.js'; // Import helper functions

const subscribersFilePath = path.join('src', 'data', 'subscribers.json');

// Fetch all subscribers
export const getSubscribersService = async () => {
  return readJsonFile(subscribersFilePath);
};

// Add a new subscriber
export const addSubscriberService = async ({ walletAddress, name }) => {
  const subscribers = readJsonFile(subscribersFilePath);
  const newSubscriber = { id: Date.now(), walletAddress, name };
  subscribers.push(newSubscriber);
  writeJsonFile(subscribersFilePath, subscribers);
  return newSubscriber;
};

// Delete a subscriber
export const deleteSubscriberService = async (id) => {
  let subscribers = readJsonFile(subscribersFilePath);
  subscribers = subscribers.filter(subscriber => subscriber.id !== id);
  writeJsonFile(subscribersFilePath, subscribers);
  return { message: 'Subscriber deleted' };
};
