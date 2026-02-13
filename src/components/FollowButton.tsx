import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  initialFollowing?: boolean;
  onToggle?: (following: boolean) => void;
  size?: "sm" | "default";
  className?: string;
}

const FollowButton = ({ initialFollowing = false, onToggle, size = "sm", className }: FollowButtonProps) => {
  const [following, setFollowing] = useState(initialFollowing);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowing(!following);
    onToggle?.(!following);
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      size={size}
      onClick={handleClick}
      className={cn("rounded-full gap-1.5", className)}
    >
      {following ? (
        <>
          <UserCheck className="w-3.5 h-3.5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
