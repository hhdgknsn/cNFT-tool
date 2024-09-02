// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import CreateCampaignForm from '../components/CreateCampaignForm';
import CampaignList from '../components/CampaignList';
import { fetchCampaigns } from '../services/campaignService';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    setLoading(true);
    setError('');
    setMessage('');
    fetchCampaigns()
      .then((data) => {
        setCampaigns(data);
        setMessage('Campaigns loaded successfully!');
      })
      .catch((err) => setError('Failed to fetch campaigns.'))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>cNFT Campaigns</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <CreateCampaignForm onCampaignCreated={loadCampaigns} />
      <CampaignList campaigns={campaigns} />
    </div>
  );
};

export default HomePage;
