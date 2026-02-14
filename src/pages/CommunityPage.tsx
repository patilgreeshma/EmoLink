import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AppNavbar from "@/components/AppNavbar";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const commRes = await api.get(`/communities/${id}`);
        setCommunity(commRes.data);

        // Check if current user is member
        if (commRes.data.members.some((m: any) => m._id === user?._id || m === user?._id)) {
          setJoined(true);
        }

        const postsRes = await api.get(`/posts/community/${id}`);
        setPosts(postsRes.data);
      } catch (error) {
        console.error("Failed to fetch community data", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCommunityData();
  }, [id, user]);

  const handleJoinToggle = async () => {
    try {
      // Currently only join is implemented in the simple controller, assume toggle later or just join
      // If already joined, maybe show "Joined" disabled or handle leave (not implemented yet)
      if (joined) return;

      await api.post(`/communities/${id}/join`);
      setJoined(true);
      toast.success("Joined community!");

      // Refresh member count visually or refetch
      setCommunity((prev: any) => ({
        ...prev,
        members: [...prev.members, user?._id] // Optimistic update
      }));

    } catch (error) {
      toast.error("Failed to join community");
    }
  };

  const handlePost = (newPost: any) => {
    // Refresh posts to ensure consistent state
    const fetchPosts = async () => {
      try {
        const postsRes = await api.get(`/posts/community/${id}`);
        setPosts(postsRes.data);
      } catch (e) {
        console.error("Failed to refresh posts");
      }
    };
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Community not found.</p>
          <Link to="/communities" className="text-primary hover:underline text-sm mt-2 inline-block">Back to communities</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/communities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to communities
        </Link>

        <div className="gradient-card rounded-2xl p-6 shadow-warm-lg border border-border mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-4xl">
              {/* Fallback icon if no icon in DB */}

            </div>
            {/* <span className="text-4xl">{community.icon || "✨"}</span> */}
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-foreground">{community.name}</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {community.members.length.toLocaleString()} members
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{community.description}</p>
            </div>
            <Button
              variant={joined ? "outline" : "default"}
              className="rounded-full shrink-0"
              onClick={handleJoinToggle}
              disabled={joined}
            >
              {joined ? "Joined" : "Join"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {joined && <CreatePost onPost={handlePost} communityId={id} />}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
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
