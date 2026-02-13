import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, MessageCircle, User, LogOut, Menu, X, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
];

const AppNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
          <Sprout className="w-6 h-6" />
          Bloomly
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Button
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                className="rounded-full gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </Link>
          ))}
          <Link to="/login">
            <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              Logout
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
