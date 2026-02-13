export type LifeStage = "Student" | "Early Career" | "Mid Career" | "Founder" | "Career Break";

export const growthGoals = [
  "Building confidence",
  "Managing burnout",
  "Public speaking improvement",
  "Career clarity",
  "Stress management",
  "Work-life balance",
  "Overcoming fear of failure",
  "Improving communication skills",
] as const;

export type GrowthGoal = (typeof growthGoals)[number];

export interface UserProfile {
  id: string;
  name: string;
  lifeStage: LifeStage;
  goals: GrowthGoal[];
  growthStatement: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  userId: string;
  messages: ChatMessage[];
}

export const currentUser: UserProfile = {
  id: "me",
  name: "Alex Rivera",
  lifeStage: "Early Career",
  goals: ["Building confidence", "Career clarity", "Improving communication skills"],
  growthStatement: "I'm on a journey to find my authentic voice and build meaningful professional relationships.",
  avatar: "AR",
};

export const matchedUsers: (UserProfile & { compatibility: number })[] = [
  {
    id: "1",
    name: "Maya Chen",
    lifeStage: "Mid Career",
    goals: ["Building confidence", "Public speaking improvement", "Career clarity"],
    growthStatement: "Learning to lead with empathy and authenticity.",
    avatar: "MC",
    compatibility: 85,
  },
  {
    id: "2",
    name: "Jordan Kim",
    lifeStage: "Student",
    goals: ["Career clarity", "Improving communication skills", "Stress management"],
    growthStatement: "Figuring out my path while staying grounded.",
    avatar: "JK",
    compatibility: 78,
  },
  {
    id: "3",
    name: "Sam Patel",
    lifeStage: "Founder",
    goals: ["Managing burnout", "Work-life balance", "Building confidence"],
    growthStatement: "Building something meaningful without losing myself.",
    avatar: "SP",
    compatibility: 72,
  },
  {
    id: "4",
    name: "Riley Brooks",
    lifeStage: "Career Break",
    goals: ["Overcoming fear of failure", "Career clarity", "Building confidence"],
    growthStatement: "Taking a pause to reconnect with what truly matters.",
    avatar: "RB",
    compatibility: 68,
  },
  {
    id: "5",
    name: "Taylor Nguyen",
    lifeStage: "Early Career",
    goals: ["Improving communication skills", "Building confidence", "Stress management"],
    growthStatement: "Growing into my potential one conversation at a time.",
    avatar: "TN",
    compatibility: 82,
  },
  {
    id: "6",
    name: "Avery Williams",
    lifeStage: "Mid Career",
    goals: ["Work-life balance", "Managing burnout", "Public speaking improvement"],
    growthStatement: "Seeking harmony between ambition and well-being.",
    avatar: "AW",
    compatibility: 65,
  },
];

export const chatThreads: ChatThread[] = [
  {
    userId: "1",
    messages: [
      { id: "m1", senderId: "1", text: "Hey! I noticed we both care about building confidence. What's been working for you?", timestamp: "10:30 AM" },
      { id: "m2", senderId: "me", text: "Hi Maya! I've been journaling and practicing small talks. Still a work in progress 😊", timestamp: "10:32 AM" },
      { id: "m3", senderId: "1", text: "That's wonderful! Journaling has helped me too. Have you tried morning affirmations?", timestamp: "10:35 AM" },
      { id: "m4", senderId: "me", text: "Not yet, but I'd love to give it a try! Any tips?", timestamp: "10:37 AM" },
    ],
  },
  {
    userId: "2",
    messages: [
      { id: "m5", senderId: "2", text: "Hi Alex! Your growth statement really resonated with me.", timestamp: "Yesterday" },
      { id: "m6", senderId: "me", text: "Thanks Jordan! I'd love to chat more about career clarity sometime.", timestamp: "Yesterday" },
    ],
  },
  {
    userId: "5",
    messages: [
      { id: "m7", senderId: "me", text: "Hey Taylor! Excited to connect with someone on a similar path.", timestamp: "2 days ago" },
      { id: "m8", senderId: "5", text: "Same here! Let's share what we're learning. 🌱", timestamp: "2 days ago" },
    ],
  },
];
