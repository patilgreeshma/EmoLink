import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    if (!req.body.content) {
        return res.status(400).json({ message: 'Please add content' });
    }

    try {
        const post = await Post.create({
            author: req.user.id,
            content: req.body.content,
            growthTags: req.body.growthTags,
            community: req.body.community || null
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feed posts (following + communities)
// @route   GET /api/posts/feed
// @access  Private
export const getFeed = async (req, res) => {
    try {
        // Get all posts (Global Feed for now as requested)
        const feedPosts = await Post.find()
            .populate('author', 'name lifeStage')
            .populate('community', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name lifeStage')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.push(req.user.id);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentPost = async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({ message: 'Please add text' });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            text: req.body.text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
