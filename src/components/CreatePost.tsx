import { useState, useRef } from "react";
import { growthGoals, GrowthGoal } from "@/data/mockData";
import GoalTag from "./GoalTag";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Image, X } from "lucide-react";

interface CreatePostProps {
  onPost?: (newPost: any) => void;
  communityId?: string;
}

const CreatePost = ({ onPost, communityId }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<GrowthGoal[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (tag: GrowthGoal) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (selectedTags.length > 0) {
        formData.append("growthTags", JSON.stringify(selectedTags));
      }
      if (communityId) {
        formData.append("community", communityId);
      }
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPost?.(data);
      setContent("");
      setSelectedTags([]);
      setShowTags(false);
      clearFile();
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

          {previewUrl && (
            <div className="relative mt-2 rounded-lg overflow-hidden max-h-60 bg-muted/20">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={clearFile}
              >
                <X className="w-3 h-3" />
              </Button>
              {selectedFile?.type.startsWith('video') ? (
                <video src={previewUrl} controls className="w-full h-full object-contain" />
              ) : (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          )}
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
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary px-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="w-4 h-4 mr-1" />
            Media
          </Button>
          <button
            onClick={() => setShowTags(!showTags)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
          >
            {showTags ? "Hide tags" : "+ Add tags"}
          </button>
        </div>
        <Button size="sm" className="rounded-full" onClick={handlePost} disabled={(!content.trim() && !selectedFile) || isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
