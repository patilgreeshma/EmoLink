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

  // Restoring profile state which was accidentally removed
  const [profile, setProfile] = useState<any>(null);

  // List modal state
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const UserListModal = ({ title, users, onClose }: { title: string, users: any[], onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl w-full max-w-sm max-h-[80vh] overflow-hidden flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">X</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3">
          {users && users.length > 0 ? users.map((u: any) => (
            <div key={u._id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-sm font-bold text-primary">
                {u.avatar ? (
                  <img
                    src={u.avatar.startsWith('http') ? u.avatar : `http://localhost:5000${u.avatar}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  u.name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.lifeStage}</p>
              </div>
            </div>
          )) : <p className="text-center text-muted-foreground">No users yet.</p>}
        </div>
      </div>
    </div>
  );
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
          image: p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`) : undefined,
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

  // Use real joined communities from profile
  const joinedCommunities = profile.joinedCommunities || [];

  const userInitials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "ME";

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <div className="gradient-card rounded-2xl p-8 shadow-warm-lg border border-border mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden cursor-pointer">
                {/* Image Upload Input */}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('profileImage', file);
                      try {
                        // Optimistic update
                        const objectUrl = URL.createObjectURL(file);
                        setProfile((prev: any) => ({ ...prev, avatar: objectUrl }));

                        const res = await api.put('/users/profile', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        setProfile((prev: any) => ({ ...prev, avatar: res.data.profileImage || res.data.avatar })); // Adjust based on API response
                        toast.success("Profile picture updated!");
                      } catch (err) {
                        console.error("Failed to upload profile image", err);
                        toast.error("Failed to update profile picture");
                      }
                    }
                  }}
                />
                {profile.avatar ? (
                  <img
                    src={profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5000${profile.avatar}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Pencil className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.lifeStage}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="cursor-pointer hover:underline" onClick={() => setShowFollowers(true)}>
                    <strong className="text-foreground">{profile.followers?.length || 0}</strong> <span className="text-muted-foreground">Followers</span>
                  </span>
                  <span className="cursor-pointer hover:underline" onClick={() => setShowFollowing(true)}>
                    <strong className="text-foreground">{profile.following?.length || 0}</strong> <span className="text-muted-foreground">Following</span>
                  </span>
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
