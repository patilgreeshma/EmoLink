// Rule-based chatbot with pre-programmed empathetic responses
// This provides emotional support without requiring external APIs

const responses = {
    // Greetings
    greetings: [
        "Hello! I'm here to listen. How are you feeling today?",
        "Hi there! It's good to see you. What's on your mind?",
        "Hey! I'm here for you. How can I support you today?"
    ],

    // Stress and overwhelm
    stress: [
        "I hear you. Feeling stressed is completely normal. Remember to take deep breaths and tackle one thing at a time. You're doing better than you think! 💙",
        "Stress can feel overwhelming, but you're not alone. Try breaking your tasks into smaller steps. What's one small thing you can do right now to feel a bit better?",
        "It sounds like you're carrying a lot right now. Be gentle with yourself. Taking a short break or a walk can help reset your mind. You've got this! 🌟"
    ],

    // Anxiety and worry
    anxiety: [
        "Anxiety can be really tough. Remember, it's okay to feel this way. Try grounding yourself - name 5 things you can see, 4 you can touch, 3 you can hear. You're safe. 💚",
        "I understand how overwhelming anxiety can feel. Focus on what you can control right now. Your feelings are valid, and this moment will pass.",
        "Worrying is your mind trying to protect you, but you're stronger than your worries. Take it one moment at a time. I'm here with you. 🌸"
    ],

    // Sadness and depression
    sadness: [
        "I'm sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes. Please reach out to someone you trust or a professional if you need more support. 💜",
        "Sadness is part of being human. Be kind to yourself today. Do something small that brings you comfort - a warm drink, your favorite song, or talking to a friend.",
        "I hear your pain. Remember that this feeling won't last forever, even though it's hard right now. You matter, and your feelings matter. 🌈"
    ],

    // Loneliness
    loneliness: [
        "Feeling lonely is hard, but you're not alone in feeling this way. Consider reaching out to someone - even a small connection can help. You're valued and important. 💛",
        "Loneliness can feel heavy. Remember, it's okay to reach out. Join a community, call a friend, or even chat here. You deserve connection and support.",
        "I'm here with you. Loneliness is temporary, even when it doesn't feel that way. What's one small step you could take to connect with someone today? 🤗"
    ],

    // Work/career stress
    work: [
        "Work stress is real! Remember that your worth isn't defined by your productivity. Take breaks, set boundaries, and celebrate small wins. You're doing great! 💼",
        "Career challenges can feel overwhelming. Focus on what you can control, and don't forget to acknowledge your progress. You're more capable than you realize!",
        "It's okay to feel stressed about work. Try to separate your work identity from your personal worth. You are valuable beyond your job. Take care of yourself! ✨"
    ],

    // Relationships
    relationships: [
        "Relationships can be complex. Remember, healthy communication and boundaries are key. Your feelings and needs are important too. 💕",
        "Navigating relationships is challenging. Be honest about your feelings, listen actively, and remember that it's okay to prioritize your own well-being.",
        "Relationship struggles are normal. Focus on what you can control - your own actions and communication. You deserve respect and understanding. 🌺"
    ],

    // Self-doubt and confidence
    confidence: [
        "Self-doubt is something everyone experiences. Remember your past successes and strengths. You're more capable than you give yourself credit for! 🌟",
        "It's okay to doubt yourself sometimes, but don't let it define you. List three things you're good at - I bet there are many more! You've got this!",
        "Confidence grows with practice. Start small, celebrate your wins, and be patient with yourself. You're on a journey, and that's beautiful. 💪"
    ],

    // Gratitude and positivity
    gratitude: [
        "That's wonderful! Practicing gratitude can really shift our perspective. What else are you grateful for today? 🌻",
        "I love hearing positive thoughts! Keep nurturing that gratitude - it's a powerful tool for well-being. You're doing great! ✨",
        "Beautiful! Gratitude is such a gift. Keep focusing on the good, even in small moments. You're creating positive energy! 🌈"
    ],

    // General encouragement
    encouragement: [
        "You're doing better than you think! Every step forward, no matter how small, is progress. Keep going! 💙",
        "I believe in you! You have the strength to get through this. Take it one day at a time. 🌟",
        "You're not alone in this journey. Be kind to yourself, and remember that growth takes time. You're worthy of good things! 💚"
    ],

    // Default responses
    default: [
        "I hear you. Your feelings are valid. Would you like to tell me more about what's going on?",
        "Thank you for sharing that with me. How are you feeling about it right now?",
        "I'm here to listen. What's weighing on your mind today?",
        "That sounds important. How can I support you with this?",
        "I appreciate you opening up. Remember, it's okay to feel whatever you're feeling. 💙"
    ]
};

// Keywords to match user messages to response categories
const patterns = {
    greetings: /\b(hi|hello|hey|good morning|good evening|greetings)\b/i,
    stress: /\b(stress|stressed|overwhelm|overwhelmed|too much|pressure|busy|exhausted)\b/i,
    anxiety: /\b(anxious|anxiety|worried|worry|nervous|panic|fear|scared)\b/i,
    sadness: /\b(sad|depressed|down|unhappy|crying|hopeless|empty|numb)\b/i,
    loneliness: /\b(lonely|alone|isolated|no one|nobody|disconnect)\b/i,
    work: /\b(work|job|career|boss|colleague|deadline|project|meeting)\b/i,
    relationships: /\b(relationship|partner|friend|family|breakup|conflict|argue)\b/i,
    confidence: /\b(doubt|confidence|insecure|not good enough|imposter|failure|fail)\b/i,
    gratitude: /\b(grateful|thankful|appreciate|blessed|happy|good|great|wonderful)\b/i,
    encouragement: /\b(help|support|advice|what should|how do i|can you)\b/i
};

// Function to get a random response from a category
const getRandomResponse = (category) => {
    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};

// Function to match user message to appropriate response
const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Check each pattern
    for (const [category, pattern] of Object.entries(patterns)) {
        if (pattern.test(lowerMessage)) {
            return getRandomResponse(category);
        }
    }

    // Default response if no pattern matches
    return getRandomResponse('default');
};

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Get appropriate response based on message content
        const botResponse = getResponse(message);

        // Simulate a slight delay to make it feel more natural
        await new Promise(resolve => setTimeout(resolve, 500));

        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ message: "Failed to generate response", error: error.message });
    }
};
