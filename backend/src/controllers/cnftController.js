import { mintChildCnftToCollection } from '../services/cnftService.js';  // Import the minting function
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cnftsFilePath = path.join(__dirname, '../data/cnfts.json');

// Function to fetch stored cNFTs
export const getStoredCnfts = async (req, res) => {
  try {
    const cnftsData = fs.readFileSync(cnftsFilePath, 'utf8');
    const cnfts = JSON.parse(cnftsData);
    return res.status(200).json(cnfts);
  } catch (error) {
    console.error('Error reading stored cNFTs:', error.message);
    return res.status(500).json({ message: 'Error fetching stored cNFTs.' });
  }
};

export const createCnftController = async (req, res) => {
  try {
    const { name, description, creator } = req.body;
    const { collectionId } = req.params; // collectionId is the collectionMint string

    console.log('Request body:', req.body);  // Log the request body
    console.log('Request params:', req.params);  // Log the request parameters

    if (!name || !description || !creator) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Proceed with minting the cNFT
    const mintResult = await mintChildCnftToCollection(collectionId, { name, description, creator });
    console.log('Mint Result:', mintResult);  // Log the result from minting

    return res.status(200).json({ message: 'cNFT minted successfully!', result: mintResult });
  } catch (error) {
    console.error('Error in createCnftController:', error.message);  // Log error message
    return res.status(500).json({ message: error.message });
  }
};
