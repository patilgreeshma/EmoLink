import { Link } from "react-router-dom";
import { currentUser, communities } from "@/data/mockData";
import GoalTag from "./GoalTag";

const SidebarLeft = () => {
  const joinedCommunities = communities.filter((c) => c.joined);

  return (
    <aside className="space-y-4">
      {/* Profile Summary */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <Link to="/profile" className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {currentUser.avatar}
          </div>
          <div>
            <p className="font-heading font-bold text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.lifeStage}</p>
          </div>
        </Link>
        <div className="flex gap-4 text-center text-xs text-muted-foreground mb-3">
          <div>
            <p className="font-bold text-foreground text-sm">{currentUser.followers}</p>
            Followers
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{currentUser.following}</p>
            Following
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">"{currentUser.growthStatement}"</p>
      </div>

      {/* Growth Goals */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Growth Goals</h3>
        <div className="flex flex-wrap gap-1.5">
          {currentUser.goals.map((goal) => (
            <GoalTag key={goal} label={goal} size="sm" highlighted />
          ))}
        </div>
      </div>

      {/* Communities Joined */}
      {joinedCommunities.length > 0 && (
        <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
          <h3 className="font-heading font-bold text-sm text-foreground mb-3">My Communities</h3>
          <div className="space-y-2">
            {joinedCommunities.map((c) => (
              <Link
                key={c.id}
                to={`/community/${c.id}`}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>{c.icon}</span>
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarLeft;
