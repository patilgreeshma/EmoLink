import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppNavbar from "@/components/AppNavbar";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { communities, Post, GrowthGoal } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const community = communities.find((c) => c.id === id);
  const [joined, setJoined] = useState(community?.joined ?? false);
  const [posts, setPosts] = useState<Post[]>(community?.posts ?? []);

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Community not found.</p>
          <Link to="/feed" className="text-primary hover:underline text-sm mt-2 inline-block">Back to feed</Link>
        </div>
      </div>
    );
  }

  const handlePost = (content: string, tags: GrowthGoal[]) => {
    const newPost: Post = {
      id: `cp-${Date.now()}`,
      authorId: "me",
      content,
      tags,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      communityId: community.id,
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>

        <div className="gradient-card rounded-2xl p-6 shadow-warm-lg border border-border mb-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{community.icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-foreground">{community.name}</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {community.members.toLocaleString()} members
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{community.description}</p>
            </div>
            <Button
              variant={joined ? "outline" : "default"}
              className="rounded-full shrink-0"
              onClick={() => setJoined(!joined)}
            >
              {joined ? "Joined" : "Join"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {joined && <CreatePost onPost={handlePost} />}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No posts yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
