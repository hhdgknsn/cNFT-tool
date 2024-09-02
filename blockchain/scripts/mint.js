// src/mint.js
import * as anchor from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configure the client to use the local cluster.
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = anchor.Wallet.local();
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: 'processed',
});
anchor.setProvider(provider);

const idl = JSON.parse(
  fs.readFileSync('target/idl/cnft_program.json', 'utf8')
);
const program = new anchor.Program(idl, process.env.PROGRAM_ID, provider);

// Mint function
async function mintCNFT() {
  try {
    const mintAccount = Keypair.generate();
    const user = provider.wallet.publicKey;

    const tx = await program.methods
      .mintCnft("https://example.com/metadata.json") // Replace with actual metadata URI
      .accounts({
        mint: mintAccount.publicKey,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([mintAccount])
      .rpc();

    console.log('Mint transaction successful:', tx);
  } catch (error) {
    console.error('Failed to mint cNFT:', error);
  }
}

mintCNFT();
