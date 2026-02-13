import { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { feedPosts, Post, GrowthGoal } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts/feed");
      // Map backend data to frontend Post interface
      const mappedPosts = data.map((p: any) => ({
        id: p._id,
        authorId: p.author._id,
        author: {
          id: p.author._id,
          name: p.author.name,
          avatar: p.author.avatar || p.author.name.substring(0, 2).toUpperCase(),
          lifeStage: p.author.lifeStage,
        },
        content: p.content,
        tags: p.growthTags || [],
        timestamp: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
        likes: p.likes.length,
        comments: p.comments.length,
        liked: p.likes.includes(user?._id),
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      // Fallback to mock data if API fails to avoid empty screen during dev
      setPosts(feedPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleNewPost = (newPostData: any) => {
    // Optimistic update or refetch
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
          {/* Left Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <SidebarLeft />
            </div>
          </div>

          {/* Center Feed */}
          <div className="space-y-4">
            <CreatePost onPost={handleNewPost} />
            {loading ? (
              <p className="text-center text-muted-foreground">Loading feed...</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* Right Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <SidebarRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
