import User from '../models/User.js';
import { calculateMatchScore } from '../utils/matchAlgorithm.js';
import { calculateAIBasedMatch } from '../utils/aiMatch.js';

// @desc    Get compatible users
// @route   GET /api/match
// @access  Private
export const getMatches = async (req, res) => {
    try {
        console.log('Fetching matches for user:', req.user.id);
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            console.log('User not found in DB:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User profile:', {
            name: currentUser.name,
            lifeStage: currentUser.lifeStage,
            goals: currentUser.growthGoals
        });

        // Get all users except current user and already followed users
        const users = await User.find({
            _id: {
                $ne: req.user.id,
                $nin: currentUser.following
            }
        });

        const matches = await Promise.all(users.map(async (user) => {
            // Get heuristic score as baseline
            const heuristicScore = calculateMatchScore(currentUser, user);

            // Try to get AI-based score and reason
            const aiResult = await calculateAIBasedMatch(currentUser, user);

            const compatibility = aiResult ? aiResult.score : heuristicScore;
            const matchReason = aiResult ? aiResult.reason : "Based on shared goals and life stage.";

            console.log(`Match with ${user.name}: Heuristic=${heuristicScore}, AI=${aiResult ? aiResult.score : 'N/A'}, Final=${compatibility}`);

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                lifeStage: user.lifeStage,
                growthGoals: user.growthGoals,
                strengths: user.strengths,
                avatar: user.avatar,
                bio: user.growthStatement,
                compatibility,
                matchReason,
                followers: user.followers ? user.followers.length : 0,
                following: user.following ? user.following.length : 0,
                isFollowing: currentUser.following.includes(user._id.toString())
            };
        }));

        // Sort by compatibility desc
        matches.sort((a, b) => b.compatibility - a.compatibility);

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
