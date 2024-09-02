import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';

describe('cnft_program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.CnftProgram as Program;

  let mintAccount: Keypair;
  const user = provider.wallet.publicKey;

  before(async () => {
    // Initialize the mint account
    mintAccount = Keypair.generate();
  });

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        user: user,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log('Your transaction signature', tx);
  });

  it('Mints a cNFT!', async () => {
    // Test minting a cNFT
    const tx = await program.methods
      .mintCnft('https://example.com/metadata.json') // Replace with actual metadata URI
      .accounts({
        mint: mintAccount.publicKey,
        user: user,
        systemProgram: SystemProgram.programId,
      })
      .signers([mintAccount])
      .rpc();
    console.log('Mint transaction successful:', tx);

    // You can add assertions to validate state changes or account balances, etc.
    expect(tx).to.be.a('string');
  });
});
