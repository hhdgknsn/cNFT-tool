import React, { useEffect, useState } from 'react';
import CreateCampaignForm from '../components/CreateCampaignForm';
import axios from 'axios'; 
import '../styles/homePage.css';

const HomePage = () => {
  const [metaplexCollections, setMetaplexCollections] = useState([]); // State to store fetched collections 
  const [cnfts, setCnfts] = useState([]); // State to store fetched cNFTs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectionsImages, setCollectionsImages] = useState([]); // State to store fetched collections images
  const [cnftImages, setCnftImages] = useState([]); // State to store fetched cNFT images


  useEffect(() => {
    fetchMetaplexCollections(); // Fetch collections from Metaplex on mount
    fetchStoredCnfts(); // fetch cNFTs on mount
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images/images');
      setCollectionsImages(response.data.collections); // Set collections images
      setCnftImages(response.data.cnfts); // Set cNFT images
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to fetch images.');
    }
  };
  

  // Function to fetch collections from Metaplex
  const fetchMetaplexCollections = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/collections/fetch'); // Fetch collections from Metaplex
      setMetaplexCollections(response.data);
    } catch (err) {
      console.error('Failed to fetch collections from Metaplex:', err);
      setError('Failed to fetch collections from Metaplex.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch stored cNFTs
  const fetchStoredCnfts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cnfts/fetch');
      setCnfts(response.data);
    } catch (err) {
      console.error('Failed to fetch stored cNFTs:', err);
      setError('Failed to fetch stored cNFTs.');
    }
  };

  return (
    <div className='home-page-div'>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <CreateCampaignForm 
        onCampaignCreated={fetchMetaplexCollections} 
        onCnftMinted={fetchStoredCnfts} // Pass function to fetch updated cNFT list
        collections={metaplexCollections} 
      />

      <div className='display-div'>
        <div className='display-div-inner'>
          <h2>Metaplex Collections</h2>
          <div className='display-div-inner2'>
            {metaplexCollections.length === 0 && !loading && <p>No collections found on Metaplex.</p>}
            {metaplexCollections.map((collection, index) => (
              <div key={index} className='collection-item'>
                <img 
                  src={collectionsImages[index % collectionsImages.length] || 'http://localhost:5000/assets/collection1.jpg'}
                  alt={collection.name} 
                  className='collection-image' 
                />
                <h3>{collection.name}</h3>
                <p>Description: {collection.description}</p>
                <p>Mint Address: {collection.collectionMint}</p> 
                <p>URI: {collection.uri}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className='display-div-inner'>
          <h2>Stored cNFTs</h2>
          <div className='display-div-inner2'>
            {cnfts.length === 0 && !loading && <p>No cNFTs found.</p>}
            {cnfts.map((cnft, index) => (
              <div key={index} className='cnft-item'>
                <img 
                  src={cnftImages[index % cnftImages.length] || 'http://localhost:5000/assets/cnft1.jpg'}
                  alt={cnft.name} 
                  className='cnft-image' 
                />
                <h3>{cnft.name}</h3>
                <p>Description: {cnft.description}</p>
                <p>Collection: {cnft.collection}</p>
                <p>URI: {cnft.uri}</p>
              </div>
            ))}
          </div>        
        </div>
        
      </div>
      
    </div>
  );
};

export default HomePage;
