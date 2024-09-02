import campaignModel from '../models/campaignModel.js';

export const createCampaign = async (campaignData) => {
  return campaignModel.create(campaignData);
};

export const getCampaigns = async () => {
  return campaignModel.findAll();
};
