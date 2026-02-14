import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;
