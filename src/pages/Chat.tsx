import { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import ChatBubble from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface User {
  _id: string;
  name: string;
  avatar?: string;
  lifeStage?: string;
}

interface Message {
  _id: string;
  sender: User;
  text: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  participants: User[];
  latestMessage?: Message;
  updatedAt: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // Fetch all chats for the user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get("/chat");
        setChats(data);
        if (data.length > 0 && !activeChatId) {
          setActiveChatId(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoadingChats(false);
      }
    };
    if (user) fetchChats();
  }, [user]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${activeChatId}`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Could not load messages");
      }
    };

    fetchMessages();

    // Optional: Poll for new messages every few seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    try {
      const { data } = await api.post("/chat/send", {
        chatId: activeChatId,
        text: newMessage
      });

      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.participants.find(p => p._id !== user?._id) || chat.participants[0];
  };

  const activeChat = chats.find(c => c._id === activeChatId);
  const otherUser = activeChat ? getOtherUser(activeChat) : null;

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
              {loadingChats ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Loading...</p>
              ) : chats.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No conversations yet.</p>
              ) : (
                chats.map((chat) => {
                  const other = getOtherUser(chat);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => setActiveChatId(chat._id)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-muted/60",
                        activeChatId === chat._id && "bg-muted"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                        {other.avatar ? (
                          <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
                        ) : (
                          other.name?.substring(0, 2).toUpperCase() || "??"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">{other.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true }) : ""}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeChat && otherUser ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                    ) : (
                      otherUser.name?.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">{otherUser.name}</p>
                    <p className="text-xs text-muted-foreground">{otherUser.lifeStage || "Member"}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg._id}
                      text={msg.text}
                      timestamp={formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      isSender={msg.sender._id === user?._id}
                    />
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
                Select a conversation or start a new one from Discover
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
