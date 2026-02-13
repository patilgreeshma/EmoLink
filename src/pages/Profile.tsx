import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import GoalTag from "@/components/GoalTag";
import PostCard from "@/components/PostCard";
import { currentUser, feedPosts, communities } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const userPosts = feedPosts.filter((p) => p.authorId === "me");
  const joinedCommunities = communities.filter((c) => c.joined);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <div className="gradient-card rounded-2xl p-8 shadow-warm-lg border border-border mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {currentUser.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">{currentUser.name}</h1>
                <p className="text-muted-foreground">{currentUser.lifeStage}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><strong className="text-foreground">{currentUser.followers}</strong> <span className="text-muted-foreground">Followers</span></span>
                  <span><strong className="text-foreground">{currentUser.following}</strong> <span className="text-muted-foreground">Following</span></span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={() => {
                setEditing(!editing);
                if (editing) toast.success("Profile saved! 🌱");
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
              {editing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Growth Goals</h2>
            <div className="flex flex-wrap gap-2">
              {currentUser.goals.map((goal) => (
                <GoalTag key={goal} label={goal} highlighted />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Growth Statement</h2>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-foreground italic leading-relaxed">"{currentUser.growthStatement}"</p>
            </div>
          </div>

          {/* Communities */}
          {joinedCommunities.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Communities</h2>
              <div className="flex flex-wrap gap-2">
                {joinedCommunities.map((c) => (
                  <Link key={c.id} to={`/community/${c.id}`} className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <span>{c.icon}</span> {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        <h2 className="font-heading font-bold text-lg text-foreground mb-4">Posts</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
