// src/deploy.js
import * as anchor from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { SystemProgram } = anchor.web3;

// Load the IDL file and the program ID from the deployed program
const idl = JSON.parse(
  fs.readFileSync('target/idl/cnft_program.json', 'utf8')
);

// Configure the connection to the Solana network
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Load wallet keypair from environment variable or local file
const wallet = anchor.Wallet.local();

// Set the provider for Anchor
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: 'processed',
});
anchor.setProvider(provider);

// Define the program
const program = new anchor.Program(idl, process.env.PROGRAM_ID, provider);

// Deploy function
async function deploy() {
  try {
    // Initialize a new keypair for the program
    const programKeypair = Keypair.generate();
    
    // Deploy the program
    await provider.send(
      new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: programKeypair.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            program.programId.toBuffer().length
          ),
          space: program.programId.toBuffer().length,
          programId: new PublicKey(process.env.PROGRAM_ID),
        })
      )
    );

    console.log(`Program deployed to ${program.programId}`);
  } catch (error) {
    console.error('Failed to deploy program:', error);
  }
}

deploy();
