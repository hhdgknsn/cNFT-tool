import express from 'express';
import { createCollectionController, getCollectionsController, fetchCollectionsFromMetaplexController } from '../controllers/collectionController.js';

const router = express.Router();

router.post('/create', createCollectionController);
router.get('/', getCollectionsController);
router.get('/fetch', fetchCollectionsFromMetaplexController); // New endpoint to fetch collections from Metaplex

export default router;
