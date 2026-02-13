import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { feedPosts, Post, GrowthGoal } from "@/data/mockData";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(feedPosts);

  const handleNewPost = (content: string, tags: GrowthGoal[]) => {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      authorId: "me",
      content,
      tags,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
