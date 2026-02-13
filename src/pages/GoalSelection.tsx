import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GoalTag from "@/components/GoalTag";
import AppNavbar from "@/components/AppNavbar";
import { growthGoals, GrowthGoal } from "@/data/mockData";

const GoalSelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<GrowthGoal[]>([]);
  const [statement, setStatement] = useState("");

  const toggle = (goal: GrowthGoal) => {
    setSelected((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            What are you currently working on?
          </h1>
          <p className="text-muted-foreground">
            Select the goals that resonate with you right now.
          </p>
        </div>

        <div className="gradient-card rounded-2xl p-8 shadow-warm border border-border">
          <div className="flex flex-wrap gap-3 mb-8">
            {growthGoals.map((goal) => (
              <GoalTag
                key={goal}
                label={goal}
                selected={selected.includes(goal)}
                onClick={() => toggle(goal)}
              />
            ))}
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-sm font-medium text-foreground">
              Describe your current growth journey
            </label>
            <Textarea
              placeholder="I'm working on becoming more confident in meetings and learning to set healthy boundaries..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="rounded-xl resize-none min-h-[100px]"
            />
          </div>

          <Button
            onClick={() => navigate("/discover")}
            className="w-full rounded-full"
            size="lg"
          >
            Continue to Discover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
