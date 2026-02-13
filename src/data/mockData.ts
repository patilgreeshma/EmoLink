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
  followers: number;
  following: number;
  isFollowing?: boolean;
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

export interface Post {
  id: string;
  authorId: string;
  content: string;
  tags: GrowthGoal[];
  timestamp: string;
  likes: number;
  comments: number;
  liked?: boolean;
  communityId?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: string;
  joined?: boolean;
  posts: Post[];
}

export const currentUser: UserProfile = {
  id: "me",
  name: "Alex Rivera",
  lifeStage: "Early Career",
  goals: ["Building confidence", "Career clarity", "Improving communication skills"],
  growthStatement: "I'm on a journey to find my authentic voice and build meaningful professional relationships.",
  avatar: "AR",
  followers: 124,
  following: 89,
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
    followers: 312,
    following: 156,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Jordan Kim",
    lifeStage: "Student",
    goals: ["Career clarity", "Improving communication skills", "Stress management"],
    growthStatement: "Figuring out my path while staying grounded.",
    avatar: "JK",
    compatibility: 78,
    followers: 89,
    following: 42,
    isFollowing: false,
  },
  {
    id: "3",
    name: "Sam Patel",
    lifeStage: "Founder",
    goals: ["Managing burnout", "Work-life balance", "Building confidence"],
    growthStatement: "Building something meaningful without losing myself.",
    avatar: "SP",
    compatibility: 72,
    followers: 534,
    following: 201,
    isFollowing: true,
  },
  {
    id: "4",
    name: "Riley Brooks",
    lifeStage: "Career Break",
    goals: ["Overcoming fear of failure", "Career clarity", "Building confidence"],
    growthStatement: "Taking a pause to reconnect with what truly matters.",
    avatar: "RB",
    compatibility: 68,
    followers: 67,
    following: 34,
    isFollowing: false,
  },
  {
    id: "5",
    name: "Taylor Nguyen",
    lifeStage: "Early Career",
    goals: ["Improving communication skills", "Building confidence", "Stress management"],
    growthStatement: "Growing into my potential one conversation at a time.",
    avatar: "TN",
    compatibility: 82,
    followers: 198,
    following: 121,
    isFollowing: true,
  },
  {
    id: "6",
    name: "Avery Williams",
    lifeStage: "Mid Career",
    goals: ["Work-life balance", "Managing burnout", "Public speaking improvement"],
    growthStatement: "Seeking harmony between ambition and well-being.",
    avatar: "AW",
    compatibility: 65,
    followers: 245,
    following: 178,
    isFollowing: false,
  },
];

export const feedPosts: Post[] = [
  {
    id: "p1",
    authorId: "1",
    content: "Today I gave my first presentation to 50 people. My voice was shaking, my hands were sweating, but I did it. Growth isn't about being fearless — it's about showing up anyway. 🌱",
    tags: ["Public speaking improvement", "Building confidence"],
    timestamp: "2h ago",
    likes: 42,
    comments: 8,
    liked: true,
  },
  {
    id: "p2",
    authorId: "3",
    content: "Took the afternoon off to go for a walk. As a founder, I used to feel guilty about rest. Now I know that rest IS the work. My best ideas come when I stop forcing them.",
    tags: ["Managing burnout", "Work-life balance"],
    timestamp: "4h ago",
    likes: 67,
    comments: 14,
    liked: false,
  },
  {
    id: "p3",
    authorId: "5",
    content: "Had a conversation with my mentor about imposter syndrome. She told me: 'The fact that you question yourself means you care deeply.' That reframe changed everything for me today.",
    tags: ["Building confidence", "Career clarity"],
    timestamp: "6h ago",
    likes: 89,
    comments: 21,
    liked: true,
  },
  {
    id: "p4",
    authorId: "2",
    content: "I've been journaling for 30 days straight now. The clarity I've gained about what I actually want from my career is incredible. If you're feeling lost, just start writing. ✍️",
    tags: ["Career clarity", "Stress management"],
    timestamp: "8h ago",
    likes: 34,
    comments: 5,
    liked: false,
  },
  {
    id: "p5",
    authorId: "6",
    content: "Reminder to everyone in leadership: vulnerability is not weakness. Today I told my team I was struggling, and the support that came back was overwhelming. We're all human first. 💛",
    tags: ["Improving communication skills", "Work-life balance"],
    timestamp: "12h ago",
    likes: 112,
    comments: 28,
    liked: false,
  },
  {
    id: "p6",
    authorId: "me",
    content: "Started a new morning routine: 10 minutes of breathing exercises before checking my phone. Day 5 and I already feel a difference in how I approach my day. Small changes, big impact.",
    tags: ["Stress management", "Building confidence"],
    timestamp: "1d ago",
    likes: 23,
    comments: 7,
    liked: false,
  },
];

export const communities: Community[] = [
  {
    id: "c1",
    name: "Burnout Recovery",
    description: "A supportive space for those navigating burnout. Share strategies, find solidarity, and rebuild together.",
    members: 1243,
    icon: "🔥",
    joined: true,
    posts: [
      {
        id: "cp1",
        authorId: "3",
        content: "Week 3 of my recovery plan. Setting boundaries at work has been the hardest but most rewarding part.",
        tags: ["Managing burnout"],
        timestamp: "3h ago",
        likes: 19,
        comments: 4,
        communityId: "c1",
      },
    ],
  },
  {
    id: "c2",
    name: "Public Speaking Practice",
    description: "Practice your speaking skills in a judgment-free zone. Weekly virtual meetups and supportive feedback.",
    members: 876,
    icon: "🎤",
    joined: false,
    posts: [
      {
        id: "cp2",
        authorId: "1",
        content: "Hosting a practice session this Friday! Topic: 'Telling your story in 2 minutes.' Who's in?",
        tags: ["Public speaking improvement"],
        timestamp: "5h ago",
        likes: 31,
        comments: 12,
        communityId: "c2",
      },
    ],
  },
  {
    id: "c3",
    name: "Career Clarity Circle",
    description: "For those figuring out their next step. Group reflections, career mapping exercises, and peer mentorship.",
    members: 2105,
    icon: "🧭",
    joined: true,
    posts: [
      {
        id: "cp3",
        authorId: "2",
        content: "I finally realized I don't have to have it all figured out right now. Progress > perfection.",
        tags: ["Career clarity"],
        timestamp: "1d ago",
        likes: 45,
        comments: 9,
        communityId: "c3",
      },
    ],
  },
  {
    id: "c4",
    name: "Stress Management Hub",
    description: "Evidence-based techniques and community support for managing daily stress and building resilience.",
    members: 1567,
    icon: "🧘",
    joined: false,
    posts: [
      {
        id: "cp4",
        authorId: "5",
        content: "Tried box breathing for the first time during a stressful meeting. Game changer!",
        tags: ["Stress management"],
        timestamp: "2d ago",
        likes: 28,
        comments: 6,
        communityId: "c4",
      },
    ],
  },
];

export const trendingTopics = [
  "Morning routines for mental clarity",
  "Setting boundaries without guilt",
  "The power of vulnerability at work",
  "Journaling for career direction",
  "Building confidence through small wins",
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
