export const calculateMatchScore = (user1, user2) => {
    let score = 0;

    // Base score for any user (everyone has some compatibility)
    score += 40;

    // 1. Life Stage (20 points)
    if (user1.lifeStage === user2.lifeStage) {
        score += 20;
    }

    // 2. Growth Goals (25 points)
    // Calculate overlap
    const sharedGoals = (user1.growthGoals || []).filter(goal =>
        (user2.growthGoals || []).includes(goal)
    );

    if (sharedGoals.length > 0) {
        // Points per shared goal, max 25
        score += Math.min(sharedGoals.length * 8, 25);
    }

    // 3. Complementary Strengths (15 points)
    const user1GoalsInUser2Strengths = (user1.growthGoals || []).filter(goal => (user2.strengths || []).includes(goal));
    const user2GoalsInUser1Strengths = (user2.growthGoals || []).filter(goal => (user1.strengths || []).includes(goal));

    if (user1GoalsInUser2Strengths.length > 0) score += 7.5;
    if (user2GoalsInUser1Strengths.length > 0) score += 7.5;

    return Math.round(Math.min(score, 100));
};
