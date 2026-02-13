export const calculateMatchScore = (user1, user2) => {
    let score = 0;

    // 1. Life Stage (30 points)
    if (user1.lifeStage === user2.lifeStage) {
        score += 30;
    }

    // 2. Growth Goals (40 points)
    // Calculate overlap
    const sharedGoals = user1.growthGoals.filter(goal =>
        user2.growthGoals.includes(goal)
    );

    if (sharedGoals.length > 0) {
        // 10 points per shared goal, max 40
        score += Math.min(sharedGoals.length * 10, 40);
    }

    // 3. Complementary Strengths (30 points)
    const user1GoalsInUser2Strengths = user1.growthGoals.filter(goal => user2.strengths.includes(goal));
    const user2GoalsInUser1Strengths = user2.growthGoals.filter(goal => user1.strengths.includes(goal));

    if (user1GoalsInUser2Strengths.length > 0) score += 15;
    if (user2GoalsInUser1Strengths.length > 0) score += 15;

    return score;
};
