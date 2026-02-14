import { Link } from "react-router-dom";
import GoalTag from "./GoalTag";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const SidebarLeft = () => {
  const { user } = useAuth();
  const [joinedCommunities, setJoinedCommunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await api.get("/communities");
        // Filter communities where current user is a member
        // The backend populates members, so we check if user ID is in the members array (which might be objects or IDs)
        // Ideally backend should have a 'my communities' endpoint or we filter here.
        // Based on backend communityController.js: getCommunities populates members with name.
        // So c.members will be an array of objects { _id, name }.
        if (user?._id) {
          const myCommunities = data.filter((c: any) =>
            c.members.some((m: any) => m._id === user._id || m === user._id)
          );
          setJoinedCommunities(myCommunities);
        }
      } catch (error) {
        console.error("Failed to fetch communities", error);
      }
    };

    if (user) {
      fetchCommunities();
    }
  }, [user]);

  if (!user) return null;

  // Adapt user object to match UI needs if necessary. 
  // User from AuthContext matches backend User model structure roughly.
  // user.avatar might be missing, use initials.
  const userAvatar = user.avatar || user.name.substring(0, 2).toUpperCase();

  return (
    <aside className="space-y-4">
      {/* Profile Summary */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <Link to="/profile" className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {userAvatar}
          </div>
          <div>
            <p className="font-heading font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.lifeStage}</p>
          </div>
        </Link>
        <div className="flex gap-4 text-center text-xs text-muted-foreground mb-3">
          <div>
            {/* Backend User model has followers/following arrays. Length gives count. */}
            <p className="font-bold text-foreground text-sm">{(user as any).followers?.length || 0}</p>
            Followers
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{(user as any).following?.length || 0}</p>
            Following
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">"{(user as any).growthStatement || 'No growth statement yet.'}"</p>
      </div>

      {/* Growth Goals */}
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Growth Goals</h3>
        <div className="flex flex-wrap gap-1.5">
          {((user as any).growthGoals || []).map((goal: string) => (
            <GoalTag key={goal} label={goal} size="sm" highlighted />
          ))}
          {(!((user as any).growthGoals) || (user as any).growthGoals.length === 0) && (
            <p className="text-xs text-muted-foreground">No goals set.</p>
          )}
        </div>
      </div>

      {/* Communities Joined */}
      {joinedCommunities.length > 0 && (
        <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
          <h3 className="font-heading font-bold text-sm text-foreground mb-3">My Communities</h3>
          <div className="space-y-2">
            {joinedCommunities.map((c) => (
              <Link
                key={c._id}
                to={`/communities/${c._id}`}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                {/* Use a default icon if none exists */}
                <span>{c.icon || "👥"}</span>
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
