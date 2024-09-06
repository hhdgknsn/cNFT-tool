import path from 'path';
import fs from 'fs';

export const generateMetadata = (req, res) => {
  try {
    const { name, description, external_url, attributes } = req.body; // Extract metadata properties from the request body

    // Placeholder image path
    const imagePath = path.join(__dirname, '../assets/test.jpg'); // Assuming image is in /src/assets/

    // Generate a URI for the image
    const imageUri = `http://localhost:5000/assets/test.jpg`; // Replace with your actual server URL if different

    // Define metadata according to the format provided
    const metadata = {
      name: name || 'Default Name',
      description: description || 'Default Description',
      image: imageUri,
      animation_url: external_url || '', // Optional
      external_url: external_url || '', // Optional
      attributes: attributes || [],
      properties: {
        files: [
          {
            uri: imageUri,
            type: 'image/jpg',
          },
        ],
        category: 'image',
      },
    };

    // Send the metadata JSON as a response
    res.json(metadata);
  } catch (error) {
    console.error('Error generating metadata:', error);
    res.status(500).json({ message: 'Error generating metadata' });
  }
};
