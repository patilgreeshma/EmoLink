import { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import MatchCard from "@/components/MatchCard";
import { LifeStage, UserProfile } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const stages: LifeStage[] = ["Student", "Early Career", "Mid Career", "Founder", "Career Break"];

const Discover = () => {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<(UserProfile & { compatibility: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get("/match");
        const mappedMatches = data.map((u: any) => ({
          id: u._id,
          name: u.name,
          lifeStage: u.lifeStage,
          goals: u.growthGoals || [],
          growthStatement: u.bio || "Growing every day 🌱",
          avatar: u.avatar || u.name.substring(0, 2).toUpperCase(),
          compatibility: u.compatibility || 0,
          followers: u.followers?.length || 0, // Backend might return array of IDs
          following: u.following?.length || 0,
          isFollowing: false, // Default, can be updated if backend sends this info
        }));
        setMatches(mappedMatches);
      } catch (error) {
        console.error("Failed to fetch matches", error);
        toast.error("Could not load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleConnect = async (userId: string, name: string) => {
    try {
      await api.put(`/users/follow/${userId}`);
      toast.success(`You are now following ${name}! 🌱`);
      // Update local state to reflect following status
      setMatches(prev => prev.map(u => u.id === userId ? { ...u, isFollowing: true } : u));
    } catch (error) {
      console.error("Failed to follow user", error);
      toast.error("Failed to follow user.");
    }
  };

  const filtered = matches.filter((u) => {
    const matchStage = filter === "all" || u.lifeStage === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Discover Matches</h1>
        <p className="text-muted-foreground mb-8">People who share your growth journey</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading matches...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((user) => (
              <MatchCard
                key={user.id}
                user={user}
                onConnect={() => handleConnect(user.id, user.name)}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No matches found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
