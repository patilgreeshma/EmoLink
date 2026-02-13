import { UserProfile, GrowthGoal, currentUser } from "@/data/mockData";
import GoalTag from "./GoalTag";
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

      <div className="mb-4">
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

      <Button onClick={onConnect} className="w-full rounded-full" size="sm">
        Connect
      </Button>
    </div>
  );
};

export default MatchCard;
