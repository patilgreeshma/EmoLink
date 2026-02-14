import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Calculates a compatibility score and reason using Gemini AI.
 * @param {Object} user1 - Current user profile
 * @param {Object} user2 - Potential match profile
 * @returns {Promise<{score: number, reason: string}>}
 */
export const calculateAIBasedMatch = async (user1, user2) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return null; // Fallback to heuristic
    }

    const prompt = `
    Compare these two individuals and provide a compatibility score from 0 to 100 based on their growth journey.
    They are looking for peers to grow with.
    
    Person 1 (Current User):
    - Life Stage: ${user1.lifeStage}
    - Growth Goals: ${user1.growthGoals.join(", ")}
    - Growth Statement: "${user1.growthStatement || "Not provided"}"
    
    Person 2:
    - Life Stage: ${user2.lifeStage}
    - Growth Goals: ${user2.growthGoals.join(", ")}
    - Growth Statement: "${user2.growthStatement || "Not provided"}"
    
    Instructions:
    1. Higher weight should be given to similar growth goals and complementary life stages.
    2. Deeply analyze the "Growth Statement" for shared values or emotional resonance.
    3. Respond ONLY with a valid JSON object in this format: {"score": number, "reason": "one short sentence explaining the match"}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (sometimes AI adds markdown blocks)
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error("Gemini AI Match Error:", error);
        return null;
    }
};
