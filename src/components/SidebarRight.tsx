import { matchedUsers, communities, trendingTopics } from "@/data/mockData";
import FollowButton from "./FollowButton";
import CommunityCard from "./CommunityCard";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const SidebarRight = () => {
  const suggestedUsers = matchedUsers.filter((u) => !u.isFollowing).slice(0, 3);
  const suggestedCommunities = communities.filter((c) => !c.joined).slice(0, 2);

  return (
    <aside className="space-y-4">
      {/* Suggested Connections */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Suggested Connections</h3>
        <div className="space-y-3">
          {suggestedUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.lifeStage}</p>
              </div>
              <FollowButton initialFollowing={false} size="sm" />
            </div>
          ))}
        </div>
        <Link to="/discover" className="block text-xs text-primary hover:underline mt-3 text-center">
          See all →
        </Link>
      </div>

      {/* Suggested Communities */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Communities to Join</h3>
        <div className="space-y-2">
          {suggestedCommunities.map((c) => (
            <CommunityCard key={c.id} community={c} compact />
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-primary" />
          Trending Topics
        </h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, i) => (
            <p key={i} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {topic}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
