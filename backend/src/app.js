import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import collectionRoutes from './routes/collectionRoutes.js';
import cnftRoutes from './routes/cnftRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import metadataRoutes from './routes/metadataRoutes.js'; // Import the new metadata routes
import walletRoutes from './routes/walletRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/collections', collectionRoutes);
app.use('/api/cnfts', cnftRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/metadata', metadataRoutes); // Add the new route here
app.use('/api/wallet', walletRoutes);
app.use('/api/images', imageRoutes);

// Serve static files (e.g., images) from the assets directory
app.use('/assets', express.static('src/assets'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

// Serve static files (e.g., images) from the assets directory
app.use('/assets', express.static('src/assets'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
