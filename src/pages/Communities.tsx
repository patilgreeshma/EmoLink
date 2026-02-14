import AppNavbar from "@/components/AppNavbar";
import CommunityCard from "@/components/CommunityCard";
// import { communities } from "@/data/mockData"; // Mock data removed
import { useEffect, useState } from "react";
import api from "@/lib/api";

const Communities = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Communities</h1>
        <p className="text-muted-foreground mb-8">Find your people. Grow together.</p>
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
    </div>
  );
};

export default Communities;
