import { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import GoalTag from "@/components/GoalTag";
import PostCard from "@/components/PostCard";
import { communities } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch full profile to get followers/following counts if not in auth user
        const profileRes = await api.get(`/users/${user._id}`);
        setProfile(profileRes.data);

        // Fetch user posts
        const postsRes = await api.get(`/posts/user/${user._id}`);
        const mappedPosts = postsRes.data.map((p: any) => ({
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
          liked: p.likes.includes(user._id),
        }));
        setPosts(mappedPosts);

      } catch (error) {
        console.error("Failed to fetch profile data", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20">Profile not found</div>;

  // Use mock communities for now as backend doesn't have joined communities endpoint easily accessible yet
  // or we can just filter if we had the list. For MVP, keeping mock for communities part.
  const joinedCommunities = communities.filter((c) => c.joined);

  const userInitials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "ME";

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <div className="gradient-card rounded-2xl p-8 shadow-warm-lg border border-border mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.lifeStage}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><strong className="text-foreground">{profile.followers?.length || 0}</strong> <span className="text-muted-foreground">Followers</span></span>
                  <span><strong className="text-foreground">{profile.following?.length || 0}</strong> <span className="text-muted-foreground">Following</span></span>
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
              {profile.growthGoals && profile.growthGoals.map((goal: string) => (
                <GoalTag key={goal} label={goal} highlighted />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Growth Statement</h2>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-foreground italic leading-relaxed">"{profile.bio || "Growing every day 🌱"}"</p>
            </div>
          </div>

          {/* Communities (Mock for now) */}
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
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
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
