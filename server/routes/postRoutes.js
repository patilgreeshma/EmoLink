import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
    createPost,
    getFeed,
    getUserPosts,
    likePost,
    commentPost,
    getCommunityPosts,
    deletePost,
    updatePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('media'), createPost);
router.get('/feed', protect, getFeed);
router.get('/user/:userId', protect, getUserPosts);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.get('/community/:communityId', protect, getCommunityPosts);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

export default router;
