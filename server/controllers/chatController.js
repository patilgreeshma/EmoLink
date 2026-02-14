import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Create or access a chat with a user
// @route   POST /api/chat/create
// @access  Private
export const createChat = async (req, res) => {
    const { userId } = req.body; // The other user ID

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    try {
        // Check if chat exists
        let isChat = await Chat.find({
            $and: [
                { participants: { $elemMatch: { $eq: req.user.id } } },
                { participants: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate('participants', '-password');

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            // Create new chat
            const chatData = {
                participants: [req.user.id, userId]
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                'participants',
                '-password'
            );
            res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
export const sendMessage = async (req, res) => {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        let message = await Message.create({
            sender: req.user.id,
            text: text,
            chatId: chatId
        });

        // Populate needed fields
        const fullMessage = await Message.findById(message._id)
            .populate('sender', 'name pic')
            .populate({
                path: 'chatId',
                populate: {
                    path: 'participants',
                    select: 'name pic email'
                }
            });

        res.json(fullMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages for a chat
// @route   GET /api/chat/:chatId
// @access  Private
export const getMessages = async (req, res) => {
    try {
        // First check if user is participant
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.participants.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }

        const messages = await Message.find({ chatId: req.params.chatId })
            .populate('sender', 'name pic email')
            .sort({ createdAt: 1 }); // Sort by oldest first for chat history

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
export const getChats = async (req, res) => {
    try {
        Chat.find({ participants: { $elemMatch: { $eq: req.user.id } } })
            .populate('participants', '-password')
            .sort({ updatedAt: -1 })
            .then(results => {
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
