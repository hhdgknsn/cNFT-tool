import { createCampaign, getCampaigns } from '../services/campaignService.js';

export const createCampaignController = async (req, res) => {
  try {
    const newCampaign = await createCampaign(req.body);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create campaign' });
  }
};

export const getCampaignsController = async (_req, res) => {
  try {
    const campaigns = await getCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve campaigns' });
  }
};
