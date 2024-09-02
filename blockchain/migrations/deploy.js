const anchor = require('@project-serum/anchor');

module.exports = async function (provider) {
  // Configure client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Initialize the program
  const program = anchor.workspace.CnftProgram;

  // Deploy the program using the anchor's provider
  await program.deploy();
  console.log('Program deployed successfully!');
};
