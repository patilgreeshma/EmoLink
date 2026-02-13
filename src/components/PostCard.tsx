import { useState } from "react";
import { Post, matchedUsers, currentUser } from "@/data/mockData";
import GoalTag from "./GoalTag";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Check if author is already populated (backend) or needs lookup (mock)
  // @ts-ignore
  const author = post.author || (post.authorId === "me" ? currentUser : matchedUsers.find((u) => u.id === post.authorId));

  if (!author) return null;

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
          {author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm text-foreground">{author.name}</p>
          <p className="text-xs text-muted-foreground">{author.lifeStage} · {post.timestamp}</p>
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <GoalTag key={tag} label={tag} size="sm" highlighted />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={toggleLike}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            liked ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-primary")} />
          {likeCount}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.comments}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
