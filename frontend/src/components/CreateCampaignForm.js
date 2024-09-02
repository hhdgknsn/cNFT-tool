// src/components/CreateCampaignForm.js
import React, { useState } from 'react';
import { createCampaign } from '../services/campaignService';

const CreateCampaignForm = ({ onCampaignCreated }) => {
  const [campaignData, setCampaignData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateCampaign = async () => {
    setLoading(true);
    setError('');
    const createdCampaign = await createCampaign(campaignData);
    if (createdCampaign) {
      setCampaignData({ name: '', description: '' });
      onCampaignCreated();
    } else {
      setError('Failed to create campaign.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create a New Campaign</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Campaign Name"
        value={campaignData.name}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        placeholder="Campaign Description"
        value={campaignData.description}
        onChange={handleInputChange}
      ></textarea>
      <button onClick={handleCreateCampaign} disabled={loading}>
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
    </div>
  );
};

export default CreateCampaignForm;
