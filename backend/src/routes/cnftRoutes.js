import express from 'express';
import { createCnftController, getStoredCnfts } from '../controllers/cnftController.js';

const router = express.Router();

// Route to create a new cNFT under a specific collection
router.post('/mint/:collectionId', createCnftController); // Updated route to correctly reference the controller
router.get('/fetch', getStoredCnfts);

export default router;