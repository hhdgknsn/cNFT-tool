import express from 'express';
import { createCampaignController, getCampaignsController } from '../controllers/campaignController.js';

const router = express.Router();

router.post('/', createCampaignController);
router.get('/', getCampaignsController);

export default router;
