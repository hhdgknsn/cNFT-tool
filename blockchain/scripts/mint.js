import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createTree,
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
  mintV1,
  parseLeafFromMintV1Transaction,
  findLeafAssetIdPda,
} from '@metaplex-foundation/mpl-bubblegum';
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
  none,
} from '@metaplex-foundation/umi';
import { Keypair, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl'; // Import nacl for signature verification
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Custom define __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load your existing wallet from the keypair file
const walletPath = path.resolve(__dirname, '../solana/id.json');
const walletData = JSON.parse(fs.readFileSync(walletPath));

// Validate that walletData is a valid Uint8Array of length 64
if (!Array.isArray(walletData) || walletData.length !== 64) {
  throw new Error('Invalid wallet data: Keypair must be a 64-byte array.');
}

// Initialize Umi with the specified RPC endpoint
const umi = createUmi('https://api.devnet.solana.com');

// Transform the wallet data into a usable keypair using Umi's eddsa module
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletData));

// Create a Signer from the Keypair
const signer = createSignerFromKeypair(umi, keypair);


// Set the Signer in Umi to use the wallet (initially as Tree Creator)
umi.use(signerIdentity(signer));

// Function to create a Bubblegum Tree
async function createBubblegumTree() {
  const merkleTreeSigner = generateSigner(umi);  // Generate the signer for the Merkle Tree

  const maxDepth = 14;  // Maximum depth of the tree
  const maxBufferSize = 64;  // Maximum buffer size of the tree

  const builder = await createTree(umi, {
    merkleTree: merkleTreeSigner,  // Pass the Merkle Tree Signer
    maxDepth,
    maxBufferSize,
    public: false,  // Explicitly set the tree as private (if needed)
  });

  await builder.sendAndConfirm(umi);  // Send and confirm the transaction

  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTreeSigner.publicKey);
  console.log('Merkle Tree Account Data:', merkleTreeAccount);

  const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree: merkleTreeSigner.publicKey });
  console.log('Tree Config Data:', treeConfig);

  return merkleTreeSigner;  // Return Merkle Tree public key for minting
}

// Function to mint a compressed NFT
async function mintCompressedNft() {
  const merkleTree = await createBubblegumTree();

  // Define the leaf owner (the owner of the newly minted compressed NFT)
  const leafOwner = umi.identity.publicKey;

  const nftMetadata = {
    name: 'My Compressed NFT',
    uri: 'https://example.com/cnft.json',
    sellerFeeBasisPoints: percentAmount(5.5),
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  };

  const { signature } = await mintV1(umi, {
    leafOwner,
    merkleTree,
    metadata: nftMetadata,
  }).sendAndConfirm(umi);  // Send and confirm the transaction

  console.log('Compressed NFT minted successfully!');

  // Retrieve the leaf and determine the asset ID from the mint transaction
  //const leaf = await parseLeafFromMintV1Transaction(umi, signature);
  //const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
}

// Run the mintCompressedNft function
mintCompressedNft().catch(console.error);
