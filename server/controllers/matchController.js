import User from '../models/User.js';
import { calculateMatchScore } from '../utils/matchAlgorithm.js';

// @desc    Get compatible users
// @route   GET /api/match
// @access  Private
export const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        // Get all users except current user
        const users = await User.find({ _id: { $ne: req.user.id } });

        const matches = users.map(user => {
            const score = calculateMatchScore(currentUser, user);
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                lifeStage: user.lifeStage,
                growthGoals: user.growthGoals,
                strengths: user.strengths,
                score
            };
        });

        // Sort by score desc
        matches.sort((a, b) => b.score - a.score);

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
