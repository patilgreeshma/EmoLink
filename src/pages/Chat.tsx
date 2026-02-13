import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import ChatBubble from "@/components/ChatBubble";
import { chatThreads, matchedUsers } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [activeThread, setActiveThread] = useState(chatThreads[0]?.userId ?? "");
  const [newMessage, setNewMessage] = useState("");
  const [threads, setThreads] = useState(chatThreads);

  const currentThread = threads.find((t) => t.userId === activeThread);
  const getUser = (id: string) => matchedUsers.find((u) => u.id === id);

  const handleSend = () => {
    if (!newMessage.trim() || !activeThread) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.userId === activeThread
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: Date.now().toString(), senderId: "me", text: newMessage, timestamp: "Just now" },
              ],
            }
          : t
      )
    );
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      <div className="flex-1 container mx-auto px-4 py-4 max-w-5xl">
        <div className="gradient-card rounded-2xl shadow-warm border border-border overflow-hidden flex h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="w-full max-w-[280px] border-r border-border bg-muted/30 flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-heading font-bold text-foreground">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((thread) => {
                const user = getUser(thread.userId);
                if (!user) return null;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.userId}
                    onClick={() => setActiveThread(thread.userId)}
                    className={cn(
                      "w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-muted/60",
                      activeThread === thread.userId && "bg-muted"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lastMsg?.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {currentThread ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {getUser(activeThread)?.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">{getUser(activeThread)?.name}</p>
                    <p className="text-xs text-muted-foreground">{getUser(activeThread)?.lifeStage}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {currentThread.messages.map((msg) => (
                    <ChatBubble key={msg.id} text={msg.text} timestamp={msg.timestamp} isSender={msg.senderId === "me"} />
                  ))}
                </div>

                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="rounded-xl flex-1"
                    />
                    <Button type="submit" size="icon" className="rounded-xl shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
