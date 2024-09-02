// src/services/campaignService.js

// Define placeholder campaigns to be used as defaults
const placeholderCampaigns = [
  { id: '1', name: 'Campaign 1', description: 'Description for campaign 1', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Campaign 2', description: 'Description for campaign 2', createdAt: new Date(), updatedAt: new Date() },
];

export const fetchCampaigns = async () => {
  try {
    const response = await fetch('/api/campaigns');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Use placeholder campaigns if the backend returns an empty array
    if (data.length === 0) {
      return placeholderCampaigns;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    // Return placeholder campaigns in case of a fetch failure
    return placeholderCampaigns;
  }
};

export const createCampaign = async (campaignData) => {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return null;
  }
};
