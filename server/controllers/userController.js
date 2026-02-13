import User from '../models/User.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (growth goals, strengths, etc.)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.lifeStage = req.body.lifeStage || user.lifeStage;
            user.growthGoals = req.body.growthGoals || user.growthGoals;
            user.strengths = req.body.strengths || user.strengths;
            user.growthStatement = req.body.growthStatement || user.growthStatement;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                lifeStage: updatedUser.lifeStage,
                growthGoals: updatedUser.growthGoals,
                strengths: updatedUser.strengths,
                growthStatement: updatedUser.growthStatement
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userToFollow.followers.includes(req.user.id)) {
            await userToFollow.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({ message: 'User has been followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
export const unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToUnfollow.followers.includes(req.user.id)) {
            await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({ message: 'User has been unfollowed' });
        } else {
            res.status(400).json({ message: 'You dont follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
