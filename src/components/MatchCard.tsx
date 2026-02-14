import { UserProfile, GrowthGoal, currentUser } from "@/data/mockData";
import GoalTag from "./GoalTag";
import FollowButton from "./FollowButton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface MatchCardProps {
  user: UserProfile & { compatibility: number };
  onConnect?: () => void;
}

const MatchCard = ({ user, onConnect }: MatchCardProps) => {
  const sharedGoals = user.goals.filter((g) => currentUser.goals.includes(g));

  return (
    <div className="gradient-card rounded-2xl p-6 shadow-warm border border-border hover:shadow-warm-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user.avatar}
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.lifeStage}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-peach-soft rounded-full px-3 py-1">
          <Heart className="w-3.5 h-3.5 text-accent-foreground" />
          <span className="text-sm font-semibold text-accent-foreground">{user.compatibility}%</span>
        </div>
      </div>

      <div className="flex gap-3 text-xs text-muted-foreground mb-3">
        <span><strong className="text-foreground">{user.followers}</strong> followers</span>
        <span><strong className="text-foreground">{user.following}</strong> following</span>
      </div>

      <div className="mb-4">
        {user.matchReason && (
          <p className="text-sm text-primary/80 italic mb-3 bg-primary/5 p-2 rounded-lg border-l-2 border-primary">
            "{user.matchReason}"
          </p>
        )}
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Shared Goals</p>
        <div className="flex flex-wrap gap-1.5">
          {user.goals.map((goal) => (
            <GoalTag
              key={goal}
              label={goal}
              size="sm"
              highlighted={sharedGoals.includes(goal)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <FollowButton
          userId={user.id}
          initialFollowing={user.isFollowing}
          className="flex-1"
          size="sm"
          onToggle={(isFollowing) => {
            // This is a simple way to update counts locally
            user.followers = isFollowing ? user.followers + 1 : user.followers - 1;
            user.isFollowing = isFollowing;
          }}
        />
      </div>
    </div>
  );
};

export default MatchCard;
