import AppNavbar from "@/components/AppNavbar";
import CommunityCard from "@/components/CommunityCard";
import { communities } from "@/data/mockData";

const Communities = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Communities</h1>
        <p className="text-muted-foreground mb-8">Find your people. Grow together.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
