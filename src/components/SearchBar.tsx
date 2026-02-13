import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { matchedUsers, communities } from "@/data/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = query.toLowerCase();
  const userResults = q ? matchedUsers.filter((u) => u.name.toLowerCase().includes(q)).slice(0, 4) : [];
  const communityResults = q ? communities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = userResults.length > 0 || communityResults.length > 0;

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search people, communities..."
          className="pl-9 pr-8 rounded-full bg-muted/50 border-border/50 h-9 text-sm"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-warm-lg border border-border z-50 overflow-hidden">
          {!hasResults && (
            <p className="p-4 text-sm text-muted-foreground text-center">No results found</p>
          )}
          {userResults.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 mb-1">People</p>
              {userResults.map((u) => (
                <Link
                  key={u.id}
                  to="/discover"
                  onClick={() => { setQuery(""); setOpen(false); }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {u.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.lifeStage}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {communityResults.length > 0 && (
            <div className="p-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground px-2 mb-1">Communities</p>
              {communityResults.map((c) => (
                <Link
                  key={c.id}
                  to={`/community/${c.id}`}
                  onClick={() => { setQuery(""); setOpen(false); }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.members.toLocaleString()} members</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
