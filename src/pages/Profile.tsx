import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import GoalTag from "@/components/GoalTag";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="gradient-card rounded-2xl p-8 shadow-warm-lg border border-border">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {currentUser.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">{currentUser.name}</h1>
                <p className="text-muted-foreground">{currentUser.lifeStage}</p>
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
              {currentUser.goals.map((goal) => (
                <GoalTag key={goal} label={goal} highlighted />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Growth Statement</h2>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-foreground italic leading-relaxed">"{currentUser.growthStatement}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
