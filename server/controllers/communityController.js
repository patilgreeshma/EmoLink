import Community from '../models/Community.js';
import User from '../models/User.js';

// @desc    Create a new community
// @route   POST /api/communities
// @access  Private
export const createCommunity = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const community = await Community.create({
            name,
            description,
            createdBy: req.user.id,
            members: [req.user.id] // Creator joins automatically
        });

        // Add to user's joinedCommunities
        await User.findByIdAndUpdate(req.user.id, {
            $push: { joinedCommunities: community._id }
        });

        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all communities
// @route   GET /api/communities
// @access  Private
export const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find().populate('members', 'name');
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a community
// @route   POST /api/communities/:id/join
// @access  Private
export const joinCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Use $addToSet to prevent duplicates at database level
        await Community.findByIdAndUpdate(req.params.id, {
            $addToSet: { members: req.user.id }
        });

        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { joinedCommunities: community._id }
        });

        res.status(200).json({ message: 'Joined community' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
