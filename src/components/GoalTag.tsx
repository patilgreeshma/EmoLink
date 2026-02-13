import { cn } from "@/lib/utils";

interface GoalTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  highlighted?: boolean;
  size?: "sm" | "md";
}

const GoalTag = ({ label, selected, onClick, highlighted, size = "md" }: GoalTagProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border transition-all duration-200 font-medium",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
        selected
          ? "bg-primary border-primary text-primary-foreground shadow-warm"
          : highlighted
          ? "bg-lavender-soft border-primary/30 text-primary"
          : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:bg-lavender-soft",
        onClick && "cursor-pointer"
      )}
    >
      {label}
    </button>
  );
};

export default GoalTag;
