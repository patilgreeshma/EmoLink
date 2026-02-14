import AppNavbar from "@/components/AppNavbar";
import CommunityCard from "@/components/CommunityCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Communities = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });

  const fetchCommunities = async () => {
    try {
      const { data } = await api.get("/communities");
      setCommunities(data);
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name || !newCommunity.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await api.post("/communities", newCommunity);
      setCommunities([...communities, data]);
      setShowCreateModal(false);
      setNewCommunity({ name: "", description: "" });
      toast.success("Community created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create community");
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Communities</h1>
            <p className="text-muted-foreground">Find your people. Grow together.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Community
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-center text-muted-foreground col-span-2">Loading communities...</p>
          ) : (
            communities.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))
          )}
          {!loading && communities.length === 0 && (
            <p className="text-center text-muted-foreground col-span-2">No communities found.</p>
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-heading font-bold text-lg">Create New Community</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Community Name</label>
                <Input
                  id="name"
                  placeholder="e.g. Morning Mindfulness"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="desc" className="text-sm font-medium">Description</label>
                <Textarea
                  id="desc"
                  placeholder="What is this community about?"
                  className="min-h-[100px]"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit">Create Community</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
