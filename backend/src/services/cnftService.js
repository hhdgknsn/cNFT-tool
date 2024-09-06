import * as fs from 'fs';
import * as path from 'path';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, signerIdentity, createSignerFromKeypair, publicKey } from '@metaplex-foundation/umi';
import {
  fromWeb3JsKeypair,
  toWeb3JsPublicKey,
  fromWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';
import { ed25519 } from '@noble/curves/ed25519';
import { Keypair, PublicKey } from '@solana/web3.js';
import { createTree, fetchMerkleTree, fetchTreeConfigFromSeeds, mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cnftsFilePath = path.join(__dirname, '../data/cnfts.json');

// Helper function to read JSON data from a file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return [];
  }
};

// Helper function to write JSON data to a file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Data written to JSON file successfully.');
  } catch (error) {
    console.error('Error writing to JSON file:', error);
  }
};


// Setup the EddsaInterface
const createWeb3JsEddsa = () => {
  return {
    generateKeypair: () => {
      const keypair = Keypair.generate();
      console.log('Generated Keypair:', keypair); // Log keypair
      const umiKeypair = fromWeb3JsKeypair(keypair);
      console.log('Converted to Umi Keypair:', umiKeypair); // Log converted keypair
      return umiKeypair;
    },
    createKeypairFromSecretKey: (secretKey) => {
      const web3Keypair = Keypair.fromSecretKey(secretKey);
      console.log('Keypair from Secret Key:', web3Keypair); // Log keypair from secret key
      const umiKeypair = fromWeb3JsKeypair(web3Keypair);
      console.log('Converted to Umi Keypair from Secret Key:', umiKeypair); // Log converted keypair
      return umiKeypair;
    },
    sign: (message, keypair) => {
      console.log('Signing message:', message); // Log message
      console.log('Keypair for signing:', keypair); // Log keypair
      const signature = ed25519.sign(message, keypair.secretKey.slice(0, 32));
      console.log('Generated Signature:', signature); // Log signature
      return signature;
    },
    verify: (message, signature, publicKey) => {
      console.log('Verifying message:', message); // Log message
      console.log('Signature to verify:', signature); // Log signature
      console.log('Public Key for verification:', publicKey); // Log public key
      const isValid = ed25519.verify(signature, message, publicKey.toBytes());
      console.log('Verification result:', isValid); // Log result
      return isValid;
    },
    findPda: (programId, seeds) => {
      console.log('Finding PDA for Program ID:', programId); // Log program ID
      console.log('Seeds:', seeds); // Log seeds
      const [key, bump] = PublicKey.findProgramAddressSync(
        seeds,
        toWeb3JsPublicKey(fromWeb3JsPublicKey(programId))
      );
      console.log('Found PDA Key:', key.toString()); // Log PDA key
      console.log('Bump:', bump); // Log bump
      return [fromWeb3JsPublicKey(key), bump];
    },
  };
};

// Initialize Umi
const umi = createUmi('https://api.devnet.solana.com', 'confirmed'); // Use Devnet endpoint and set commitment level
console.log("UMI CREATED");
//umi.eddsa = createWeb3JsEddsa(); // Register the Eddsa interface

// Load wallet keypair and create signer identity for Umi
const walletPath = path.resolve(__dirname, './solana/id.json'); // Adjust path to your wallet file
const walletData = JSON.parse(fs.readFileSync(walletPath));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletData));
console.log('Loaded Keypair from Secret Key:', keypair); // Log loaded keypair
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer)); // Connect Umi's identity to your wallet
console.log('Signer identity set for Umi:', signer); // Log signer identity

// Function to create a Bubblegum Tree (Merkle Tree + Tree Config)
export const createBubblegumTree = async () => {
  const merkleTreeSigner = generateSigner(umi); // Generate the signer for the Merkle Tree

  const maxDepth = 14; // Maximum depth of the tree
  const maxBufferSize = 64; // Maximum buffer size of the tree

  // Create the Merkle Tree
  const builder = await createTree(umi, {
    merkleTree: merkleTreeSigner,
    maxDepth,
    maxBufferSize,
    public: false, 
  });

  await builder.sendAndConfirm(umi); // Send and confirm the transaction

  // Fetch the Merkle Tree account data using the Merkle Tree Signer itself
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTreeSigner.publicKey);
  console.log('Merkle Tree Account Data:', merkleTreeAccount);

  // Fetch the Tree Config using the Merkle Tree Signer
  const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree: merkleTreeSigner.publicKey });
  console.log('Tree Config Data:', treeConfig);

  return merkleTreeSigner; // Return the Merkle Tree Signer for minting
};

// Function to mint a cNFT under a specific collection
export const mintChildCnftToCollection = async (collectionMintPublicKey, metadata) => {
  try {
    collectionMintPublicKey = publicKey(collectionMintPublicKey); // Convert string to PublicKey object
    console.log('Received collectionMintPublicKey:', collectionMintPublicKey, 'Type:', typeof collectionMintPublicKey);

    // Create Bubblegum Tree
    const merkleTreeSigner = await createBubblegumTree(); // Create the Bubblegum Tree

    console.log('MerkleTreeSigner:', merkleTreeSigner, 'Type:', typeof merkleTreeSigner); // Log the Merkle Tree signer
    console.log('MerkleTreeSigner public key:', merkleTreeSigner.publicKey.toString()); // Log the Merkle Tree signer's public key

    // Generate metadata entry and get URI
    const uri = `http://localhost:5000/api/metadata/generate`;

    console.log('Generated URI:', uri, 'Type:', typeof uri); // Log the generated URI

    // Mint compressed NFT to a specific collection
    const { signature } = await mintToCollectionV1(umi, {
      leafOwner: umi.identity.publicKey,
      merkleTree: merkleTreeSigner.publicKey,
      collectionMint: collectionMintPublicKey,
      metadata: {
        name: metadata.name,
        uri: uri,
        symbol: 'CNFT', // Default symbol
        sellerFeeBasisPoints: 500, // Default seller fee is 5%
        description: metadata.description,
        collection: { key: collectionMintPublicKey, verified: false }, // Ensure this is correct
        creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }], // Use wallet public key
      },
    }).sendAndConfirm(umi);

    console.log('Minting successful, signature:', signature);

    const newCnft = {
      id: signature,
      name: metadata.name,
      description: metadata.description,
      collection: collectionMintPublicKey.toString(),
      uri: uri, // Replace with actual URI if needed
    };

    // Read existing cNFTs from JSON file
    const existingCnfts = readJsonFile(cnftsFilePath);

    // Add new cNFT metadata
    existingCnfts.push(newCnft);

    // Write updated cNFT list back to the JSON file
    writeJsonFile(cnftsFilePath, existingCnfts);

    console.log('New cNFT data written to file:', newCnft); // Log new cNFT data

    return signature;
  } catch (error) {
    console.error('Error minting cNFT:', error.message);
    throw new Error(`Failed to mint cNFT: ${error.message}`);
  }
};

