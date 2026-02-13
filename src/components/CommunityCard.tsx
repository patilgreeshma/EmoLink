import { useState } from "react";
import { Community } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface CommunityCardProps {
  community: Community;
  compact?: boolean;
}

const CommunityCard = ({ community, compact = false }: CommunityCardProps) => {
  const [joined, setJoined] = useState(community.joined ?? false);

  if (compact) {
    return (
      <Link to={`/community/${community.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
        <span className="text-xl">{community.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{community.name}</p>
          <p className="text-xs text-muted-foreground">{community.members.toLocaleString()} members</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{community.icon}</span>
        <div className="flex-1 min-w-0">
          <Link to={`/community/${community.id}`} className="font-heading font-bold text-foreground hover:text-primary transition-colors">
            {community.name}
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Users className="w-3 h-3" />
            {community.members.toLocaleString()} members
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{community.description}</p>
      <Button
        variant={joined ? "outline" : "default"}
        size="sm"
        className="rounded-full w-full"
        onClick={() => setJoined(!joined)}
      >
        {joined ? "Joined" : "Join Community"}
      </Button>
    </div>
  );
};

export default CommunityCard;
