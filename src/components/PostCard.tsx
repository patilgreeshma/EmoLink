import { useState } from "react";

import GoalTag from "./GoalTag";
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { toast } from "sonner";

interface PostCardProps {
  post: any;
  onDelete?: (id: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);

  // Author is now fully populated from Feed.tsx
  const author: any = post.author;
  const isAuthor = user?._id === author._id || user?._id === author.id;

  // Handle both id and _id fields (Feed maps _id to id, CommunityPage might use _id)
  const postId = post.id || post._id;

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((c: number) => (liked ? c - 1 : c + 1));
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");
      if (onDelete) onDelete(postId);
      else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    try {
      const { data } = await api.put(`/posts/${postId}`, { content: editContent });
      toast.success("Post updated");
      setIsEditing(false);
      post.content = data.content;
      window.location.reload();
    } catch (error) {
      console.error("Failed to update post", error);
      toast.error("Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border relative group">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
            {author?.avatar ? (
              <img src={author.avatar} alt={author.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-bold">
                {author?.name ? author.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm text-foreground">{author?.name || "Unknown User"}</p>
            <p className="text-xs text-muted-foreground">{author?.lifeStage || "Member"} · {new Date(post.createdAt || post.timestamp).toLocaleDateString()}</p>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setEditContent(post.content);
                  setIsEditing(true);
                }}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete} disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>

        {/* Image Display - using 'image' field from cloudinary */}
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden bg-muted/20 border border-border">
            <img src={post.image} alt="Post image" className="w-full max-h-[400px] object-cover" />
          </div>
        )}

        {/* Handle both 'tags' (mock) and 'growthTags' (backend) */}
        {(post.growthTags || post.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(post.growthTags || post.tags || []).map((tag: string) => (
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isSaving}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
