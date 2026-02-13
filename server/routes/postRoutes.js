import express from 'express';
import {
    createPost,
    getFeed,
    getUserPosts,
    likePost,
    commentPost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/feed', protect, getFeed);
router.get('/user/:userId', protect, getUserPosts);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

export default router;
