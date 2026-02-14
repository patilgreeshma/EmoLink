import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, MessageCircle, User, LogOut, Menu, X, Sprout, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

const navItems = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
];

const AppNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-14 gap-4">
        <Link to="/feed" className="flex items-center gap-2 text-primary font-heading font-bold text-xl shrink-0">
          <Sprout className="w-6 h-6" />
          <span className="hidden sm:inline">VibeConnect</span>
        </Link>

        {/* Search - center */}
        <div className="hidden md:flex flex-1 justify-center max-w-md">
          <SearchBar />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Button
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                className="rounded-full gap-1.5 text-xs"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </Link>
          ))}
          <Link to="/login">
            <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          <div className="mb-3">
            <SearchBar />
          </div>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
              <Button
                variant={location.pathname === to ? "default" : "ghost"}
                className="w-full justify-start rounded-full gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </Link>
          ))}
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-full gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;
