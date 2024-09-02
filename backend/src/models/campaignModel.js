class CampaignModel {
  constructor() {
    this.campaigns = [];
  }

  create(campaignData) {
    const newCampaign = {
      id: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...campaignData,
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  findAll() {
    return this.campaigns;
  }
}

export default new CampaignModel();
