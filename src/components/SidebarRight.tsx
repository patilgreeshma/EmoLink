import { useEffect, useState } from "react";
import FollowButton from "./FollowButton";
import CommunityCard from "./CommunityCard";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { trendingTopics } from "@/data/mockData"; // Keep trending topics mock for now or fetch if available

const SidebarRight = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [suggestedCommunities, setSuggestedCommunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Matches
        const matchesRes = await api.get("/match");
        // Take top 3 matches
        setSuggestedUsers(matchesRes.data.slice(0, 3));

        // Fetch Communities
        const communitiesRes = await api.get("/communities");
        // Filter out joined communities
        if (user?._id) {
          const notJoined = communitiesRes.data.filter((c: any) =>
            !c.members.some((m: any) => m._id === user._id || m === user._id)
          );
          setSuggestedCommunities(notJoined.slice(0, 2));
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <aside className="space-y-4">
      {/* Suggested Connections */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Suggested Connections</h3>
        <div className="space-y-3">
          {suggestedUsers.map((u) => (
            <div key={u._id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {u.avatar || u.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.lifeStage}</p>
              </div>
              {/* Pass correct ID and initial state (matches endpoint returns users we match with, usually not followed yet) */}
              <FollowButton userId={u._id} initialFollowing={false} size="sm" />
            </div>
          ))}
          {suggestedUsers.length === 0 && <p className="text-xs text-muted-foreground">No suggestions available.</p>}
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
            // Ensure CommunityCard can handle the real community object structure
            // We might need to map it if CommunityCard expects specific props
            <CommunityCard key={c._id || c.id} community={{ ...c, id: c._id }} compact />
          ))}
          {suggestedCommunities.length === 0 && <p className="text-xs text-muted-foreground">No new communities to join.</p>}
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
