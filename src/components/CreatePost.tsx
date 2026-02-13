import { useState } from "react";
import { growthGoals, GrowthGoal } from "@/data/mockData";
import GoalTag from "./GoalTag";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface CreatePostProps {
  onPost?: (newPost: any) => void;
}

const CreatePost = ({ onPost }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<GrowthGoal[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: GrowthGoal) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/posts", {
        content,
        growthTags: selectedTags
      });

      onPost?.(data);
      setContent("");
      setSelectedTags([]);
      setShowTags(false);
      toast.success("Post shared! 🌱");
    } catch (error) {
      console.error("Failed to create post", error);
      toast.error("Failed to share post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  // Derive initials for avatar if no image
  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "ME";

  return (
    <div className="gradient-card rounded-2xl p-5 shadow-warm border border-border">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            userInitials
          )}
        </div>
        <div className="flex-1">
          <Textarea
            placeholder={`What are you working on today, ${user.name.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 min-h-[60px] placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {showTags && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
          {growthGoals.map((goal) => (
            <GoalTag
              key={goal}
              label={goal}
              size="sm"
              selected={selectedTags.includes(goal)}
              onClick={() => toggleTag(goal)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <button
          onClick={() => setShowTags(!showTags)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {showTags ? "Hide tags" : "+ Add tags"}
        </button>
        <Button size="sm" className="rounded-full" onClick={handlePost} disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
