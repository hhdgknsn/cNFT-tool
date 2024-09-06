import express from 'express';
import { generateMetadata } from '../controllers/metadataController.js'; // Import the controller

const router = express.Router();

// Define route to serve metadata
router.post('/generate', generateMetadata);

export default router;
