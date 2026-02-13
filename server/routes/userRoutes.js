import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;
