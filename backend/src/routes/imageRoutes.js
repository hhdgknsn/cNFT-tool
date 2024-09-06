import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Correct the path to the assets directory
const assetsDirectory = path.join(process.cwd(), 'src/assets');

// Route to fetch image filenames from the assets directory and categorize them
router.get('/images', (req, res) => {
  fs.readdir(assetsDirectory, (err, files) => {
    if (err) {
      console.error('Error reading assets directory:', err);
      return res.status(500).json({ message: 'Failed to load images.' });
    }

    // Filter and categorize images based on filename prefixes
    const collectionsImages = files
      .filter(file => /^collection\d+\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => `http://localhost:5000/assets/${file}`);

    const cnftImages = files
      .filter(file => /^cnft\d+\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => `http://localhost:5000/assets/${file}`);

    res.json({ collections: collectionsImages, cnfts: cnftImages });
  });
});

export default router;
