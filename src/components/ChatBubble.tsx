import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  timestamp: string;
  isSender: boolean;
}

const ChatBubble = ({ text, timestamp, isSender }: ChatBubbleProps) => {
  return (
    <div className={cn("flex mb-3", isSender ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isSender
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{text}</p>
        <p
          className={cn(
            "text-[10px] mt-1",
            isSender ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
