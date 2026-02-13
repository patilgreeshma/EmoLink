import User from '../models/User.js';
import Community from '../models/Community.js';
import Post from '../models/Post.js';

// @desc    Search users, communities, and posts
// @route   GET /api/search?q=term
// @access  Private
export const search = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Please provide a search query' });
    }

    try {
        const regex = new RegExp(query, 'i'); // Case-insensitive regex

        const users = await User.find({
            $or: [{ name: regex }, { growthGoals: regex }]
        }).select('name lifeStage growthGoals');

        const communities = await Community.find({
            name: regex
        }).select('name description members');

        const posts = await Post.find({
            content: regex
        }).populate('author', 'name');

        res.status(200).json({
            users,
            communities,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
