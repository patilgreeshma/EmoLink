import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import MatchCard from "@/components/MatchCard";
import { matchedUsers, LifeStage } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

const stages: LifeStage[] = ["Student", "Early Career", "Mid Career", "Founder", "Career Break"];

const Discover = () => {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = matchedUsers.filter((u) => {
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
              className="pl-10 rounded-xl"
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((user) => (
            <MatchCard
              key={user.id}
              user={user}
              onConnect={() => toast.success(`Connection request sent to ${user.name}! 🌱`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No matches found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
