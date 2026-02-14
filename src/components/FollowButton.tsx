import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner"; // Assuming sonner is available based on App.tsx

interface FollowButtonProps {
  userId?: string; // ID of user to follow
  initialFollowing?: boolean;
  onToggle?: (following: boolean) => void;
  size?: "sm" | "default";
  className?: string;
}

const FollowButton = ({ userId, initialFollowing = false, onToggle, size = "sm", className }: FollowButtonProps) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to follow users");
      return;
    }

    if (!userId) {
      // Fallback for UI-only usage if any
      const newState = !following;
      setFollowing(newState);
      onToggle?.(newState);
      return;
    }

    setLoading(true);
    try {
      if (following) {
        await api.post(`/users/${userId}/unfollow`);
        setFollowing(false);
        onToggle?.(false);
        toast.success("Unfollowed successfully");
      } else {
        await api.post(`/users/${userId}/follow`);
        setFollowing(true);
        onToggle?.(true);
        toast.success("Followed successfully");
      }
    } catch (error: any) {
      console.error("Follow action failed", error);
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      size={size}
      onClick={handleClick}
      disabled={loading}
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
