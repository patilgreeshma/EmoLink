import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

const LandingNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-lg border-b border-border/50">
    <div className="container mx-auto px-4 flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
        <Sprout className="w-6 h-6" />
        Emo-Link
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="rounded-full">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="rounded-full">
            Register
          </Button>
        </Link>
      </div>
    </div>
  </nav>
);

export default LandingNavbar;
