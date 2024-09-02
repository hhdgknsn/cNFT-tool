// src/components/CampaignList.js
import React, { useState } from 'react';

const CampaignList = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');

  const filteredCampaigns = campaigns
    .filter((campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));

  return (
    <div>
      <input
        type="text"
        placeholder="Search campaigns..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSortField(e.target.value)}>
        <option value="name">Name</option>
        <option value="createdAt">Creation Date</option>
      </select>
      {filteredCampaigns.map((campaign) => (
        <div key={campaign.id}>
          <h3>{campaign.name}</h3>
          <p>{campaign.description}</p>
          <p>Created At: {new Date(campaign.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;
