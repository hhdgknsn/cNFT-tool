// src/services/collectionService.js
import fs from 'fs';
import path from 'path';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, publicKey, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { createNft, verifyCollection } from '@metaplex-foundation/mpl-token-metadata';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'; 
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';


const collectionsFilePath = path.join('src', 'data', 'collections.json');
const defaultUriPath = path.join('src', 'data', 'uri.json');

// Helper function to read JSON data from a file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON data to a file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Function to create a new collection
// Function to create a new collection
export const createCollectionService = async (metadata) => {

  const defaultUriData = readJsonFile(defaultUriPath);

  const umi = createUmi('https://api.devnet.solana.com');
  
  umi.use(mplToolbox());

  // Load wallet and set signer identity
  const walletPath = path.resolve('src', 'services', 'solana', 'id.json');
  const walletData = JSON.parse(fs.readFileSync(walletPath));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletData));
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(signer));

  // Mint the collection NFT using Metaplex's createNft function
  const collectionMint = generateSigner(umi);
  const collectionResponse = await createNft(umi, {
    mint: collectionMint,
    name: metadata.name,
    uri: defaultUriData,
    sellerFeeBasisPoints: 5.5, 
    isCollection: true,
  }).sendAndConfirm(umi);

  // Read existing collections from JSON
  const collections = readJsonFile(collectionsFilePath);

  // Create new collection object to store in JSON
  const newCollection = {
    name: metadata.name,
    description: metadata.description,
    imageUrl: metadata.imageUrl,
    uri: metadata.uri,
    collectionMint: collectionMint.publicKey.toString(),
    transactionSignature: collectionResponse.signature,
  };

  // Store the new collection in JSON
  collections.push(newCollection);
  writeJsonFile(collectionsFilePath, collections);

  return newCollection; // Return newly created collection
};


// Function to get all collections from JSON file
export const getCollections = async () => {
  return readJsonFile(collectionsFilePath);
};

// Function to fetch all collections from Metaplex
export const fetchAllCollectionsFromMetaplex = async () => {
  const collectionsFilePath = path.join('src', 'data', 'collections.json'); // JSON file path
  const collections = readJsonFile(collectionsFilePath); // Read collections from JSON file

  // This array will store the fetched collections along with their existing information
  const fetchedCollections = collections.map((collection) => {
    // Retrieve necessary information directly from collections.json
    const { name, description, imageUrl, uri, collectionMint } = collection;

    // Return the base information for the collection
    return {
      name,
      description,
      imageUrl,
      uri,
      collectionMint,
    };
  });

  return fetchedCollections; // Return the fetched collections with their assets
};



