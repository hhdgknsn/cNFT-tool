import express from 'express';
import { getWalletAddress } from '../controllers/walletController.js';
const router = express.Router();

router.get('/wallet-address', getWalletAddress);  

export default router;