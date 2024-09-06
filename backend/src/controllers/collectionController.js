import { createCollectionService, getCollections, fetchAllCollectionsFromMetaplex } from '../services/collectionService.js';

// Controller to create a new collection
export const createCollectionController = async (req, res) => {
  try {
    const newCollection = await createCollectionService(req.body);
    res.status(201).json({ message: 'Collection created successfully!', collection: newCollection });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Failed to create collection', error: error.message });
  }
};

// Controller to get all collections from JSON
export const getCollectionsController = async (_req, res) => {
  try {
    const collections = await getCollections();
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve collections', error: error.message });
  }
};

// Controller to fetch collections from Metaplex
export const fetchCollectionsFromMetaplexController = async (_req, res) => {
  try {
    const fetchedCollections = await fetchAllCollectionsFromMetaplex();
    res.status(200).json(fetchedCollections);
  } catch (error) {
    console.error('Error fetching collections from Metaplex:', error);
    res.status(500).json({ message: 'Failed to fetch collections from Metaplex', error: error.message });
  }
};
