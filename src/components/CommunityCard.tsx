import { useState } from "react";
import { Community } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface CommunityCardProps {
  community: any; // Using any to support both mock and real data structure differences temporarily
  compact?: boolean;
}

const CommunityCard = ({ community, compact = false }: CommunityCardProps) => {
  // Check if current user is in members list.
  // community.members from backend is array of objects or IDs.
  // We need to handle this robustly.
  const { user } = useAuth();

  // Determine if joined based on members list if available, or 'joined' prop if passed (mock)
  const isMember = user && Array.isArray(community.members)
    ? community.members.some((m: any) => m._id === user._id || m === user._id)
    : community.joined;

  const [joined, setJoined] = useState(!!isMember);
  const [loading, setLoading] = useState(false);

  // Handle ID differences: backend uses _id, mock uses id
  const communityId = community._id || community.id;

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to join communities");
      return;
    }

    if (joined) {
      toast.info("Already a member");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/communities/${communityId}/join`);
      setJoined(true);
      toast.success("Joined community!");
    } catch (error: any) {
      console.error("Join failed", error);
      toast.error(error.response?.data?.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <Link to={`/communities/${communityId}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
        <span className="text-xl">{community.icon || "👥"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{community.name}</p>
          <p className="text-xs text-muted-foreground">{community.members?.length || community.members} members</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{community.icon || "👥"}</span>
        <div className="flex-1 min-w-0">
          <Link to={`/communities/${communityId}`} className="font-heading font-bold text-foreground hover:text-primary transition-colors">
            {community.name}
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Users className="w-3 h-3" />
            {community.members?.length || community.members} members
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{community.description}</p>
      <Button
        variant={joined ? "outline" : "default"}
        size="sm"
        className="rounded-full w-full"
        onClick={handleJoin}
        disabled={loading || joined}
      >
        {joined ? "Joined" : "Join Community"}
      </Button>
    </div>
  );
};

export default CommunityCard;
