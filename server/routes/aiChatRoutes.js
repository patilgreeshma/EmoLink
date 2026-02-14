import express from 'express';
import { chatWithAI } from '../controllers/aiChatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, chatWithAI);

export default router;
