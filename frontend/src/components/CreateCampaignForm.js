import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCampaignForm = ({ onCampaignCreated, onCnftMinted, collections = [] }) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    uri: '',
  });

  const [cnftData, setCnftData] = useState({
    name: '',
    description: '',
  });

  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cnftSuccessMessage, setCnftSuccessMessage] = useState('');

  // Automatically fill in creator address from backend
  const [creator, setCreator] = useState('');

  // Fetch creator (wallet address) from the backend on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/wallet/wallet-address')  
      .then(response => {
        if (response.data && response.data.wallet) {
          setCreator(response.data.wallet); 
        }
      })
      .catch(error => {
        console.error('Error fetching wallet address:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCnftInputChange = (e) => {
    const { name, value } = e.target;
    setCnftData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCollectionChange = (e) => {
    setSelectedCollection(e.target.value);
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/collections/create', campaignData);
      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message);
        setCampaignData({ name: '', description: '', uri: '' }); // Reset form
        onCampaignCreated(); // Refresh the list of campaigns
      } else {
        setError('Failed to create campaign.');
      }
    } catch (err) {
      setError('Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cNFT minting
  const handleMintCnft = async () => {
    if (!selectedCollection) {
      setError('Please select a collection to mint the cNFT under.');
      return;
    }

    setLoading(true);
    setError('');
    setCnftSuccessMessage('');

    try {
      // Ensure the cnftData is correctly formatted
      const cnftPayload = {
        name: cnftData.name.trim(),
        description: cnftData.description.trim(),
        creator,  // Use the wallet public key fetched from the backend
      };

      // Validate required fields
      if (!cnftPayload.name || !cnftPayload.description) {
        setError('Name and Description are required to mint a cNFT.');
        setLoading(false);
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/cnfts/mint/${selectedCollection}`, cnftPayload);
      if (response.data && response.data.message) {
        setCnftSuccessMessage(response.data.message);
        setCnftData({ name: '', description: '' }); // Reset form
        setError(''); // Clear any previous error

        onCnftMinted(); // Fetch the updated list of cNFTs after minting (if necessary)
      } else {
        setError('Failed to mint cNFT.');
      }
    } catch (err) {
      setError('Failed to mint cNFT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='createForm'>
      <div className='createForm-inner'>
        <h2>Create a New Campaign</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <div className='createForm-inner2'>
          <div className='form-div'>
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
        </div>
        
      </div>
      
      <div className='createForm-inner'>
        <h2>Mint cNFT Under a Collection</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {cnftSuccessMessage && <p style={{ color: 'green' }}>{cnftSuccessMessage}</p>}
        <div className='createForm-inner2'>
          <div className='form-div'>
            <select value={selectedCollection} onChange={handleCollectionChange}>
              <option value="">Select a Collection</option>
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <option key={collection.collectionMint} value={collection.collectionMint}>
                    {collection.name}
                  </option>
                ))
              ) : (
                <option disabled>No collections available</option>
              )}
            </select>
            <input
              type="text"
              name="name"
              placeholder="cNFT Name"
              value={cnftData.name}
              onChange={handleCnftInputChange}
            />
            <textarea
              name="description"
              placeholder="cNFT Description"
              value={cnftData.description}
              onChange={handleCnftInputChange}
            ></textarea>
            <button onClick={handleMintCnft} disabled={loading}>
              {loading ? 'Minting...' : 'Mint cNFT'}
            </button>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default CreateCampaignForm;
