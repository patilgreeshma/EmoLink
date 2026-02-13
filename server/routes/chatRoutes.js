import express from 'express';
import {
    createChat,
    sendMessage,
    getMessages,
    getChats
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createChat);
router.post('/send', protect, sendMessage);
router.get('/:chatId', protect, getMessages);
router.get('/', protect, getChats);

export default router;
