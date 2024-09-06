export const getWalletAddress = (req, res) => {
    const walletAddress = process.env.WALLET;
    res.json({ wallet: walletAddress });
  };