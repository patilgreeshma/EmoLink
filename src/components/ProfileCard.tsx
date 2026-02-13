import { UserProfile } from "@/data/mockData";
import GoalTag from "./GoalTag";

interface ProfileCardProps {
  user: UserProfile;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="gradient-card rounded-2xl p-6 shadow-warm border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
          {user.avatar}
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.lifeStage}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 italic">"{user.growthStatement}"</p>
      <div className="flex flex-wrap gap-2">
        {user.goals.map((goal) => (
          <GoalTag key={goal} label={goal} size="sm" highlighted />
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
