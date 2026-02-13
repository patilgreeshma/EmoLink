import express from 'express';
import {
    createCommunity,
    getCommunities,
    joinCommunity
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createCommunity);
router.get('/', protect, getCommunities);
router.post('/:id/join', protect, joinCommunity);

export default router;
