// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import CreateCampaignForm from '../components/CreateCampaignForm';
import CampaignList from '../components/CampaignList';
import { fetchCampaigns } from '../services/campaignService';
import '../styles/homePage.css';

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
      })
      .catch((err) => setError('Failed to fetch campaigns.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className='home-page-div'>
      <h1>cNFT Campaigns</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <CreateCampaignForm onCampaignCreated={loadCampaigns} />
      <CampaignList campaigns={campaigns} />
    </div>
  );
};

export default HomePage;
