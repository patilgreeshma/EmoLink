import { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import ChatBubble from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import io from 'socket.io-client';

// Should be from env or constant
const ENDPOINT = "http://localhost:5000";
var socket: any, selectedChatCompare: any;

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
  chatId: string | any; // backend populate structure varies
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
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]); // Users I follow
  const [socketConnected, setSocketConnected] = useState(false);

  // Initialize Socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.disconnect();
    }
  }, [user]);

  // Fetch chats and connected users
  useEffect(() => {
    const fetchChatsAndUsers = async () => {
      try {
        const chatsRes = await api.get("/chat");
        setChats(chatsRes.data);

        if (user?._id) {
          const profileRes = await api.get(`/users/${user._id}`);
          setConnectedUsers(profileRes.data.following || []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingChats(false);
      }
    };
    if (user) fetchChatsAndUsers();
  }, [user]);



  // Handle User Selection from "Connected Users" list
  const accessChat = async (userId: string) => {
    try {
      const { data } = await api.post("/chat/create", { userId });

      if (!chats.find(c => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setActiveChatId(data._id);
    } catch (error) {
      toast.error("Failed to access chat");
    }
  };

  // Fetch messages
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${activeChatId}`);
        setMessages(data);
        socket.emit("join_chat", activeChatId);
        selectedChatCompare = activeChatId;
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Could not load messages");
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // Socket Message Listener
  useEffect(() => {
    socket.on("message_received", (newMessageRecieved: Message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newMessageRecieved.chatId._id
      ) {
        // Notification logic could go here
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId) return;
    try {
      setNewMessage(""); // Optimistic clear
      const { data } = await api.post("/chat/send", {
        chatId: activeChatId,
        text: newMessage
      });

      socket.emit("new_message", data);
      setMessages([...messages, data]);
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
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-heading font-bold text-foreground">Messages</h2>
              {/* <Button size="icon" variant="ghost" className="h-8 w-8"><UserPlus className="h-4 w-4" /></Button> */}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingChats ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  {chats.length > 0 && (
                    <div className="pb-2">
                      <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversations</h3>
                      {chats.map((chat) => {
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
                                {chat.latestMessage?.text || (chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true }) : "")}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Connected Users (Following) */}
                  {connectedUsers.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Connections</h3>
                      {connectedUsers.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => accessChat(u._id)}
                          className="w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-muted/60"
                        >
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground font-bold text-sm shrink-0 overflow-hidden">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              u.name?.substring(0, 2).toUpperCase() || "??"
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.lifeStage}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {chats.length === 0 && connectedUsers.length === 0 && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">No conversations or connections yet.</p>
                      <p className="text-xs text-muted-foreground">Follow people to start chatting!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeChat && otherUser ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3 bg-card/50">
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
                  {messages.map((msg, i) => (
                    <ChatBubble
                      key={msg._id || i}
                      text={msg.text}
                      timestamp={formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      isSender={msg.sender._id === user?._id}
                    />
                  ))}
                </div>

                <div className="p-4 border-t border-border bg-card/50">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="rounded-xl flex-1 border-muted-foreground/20"
                    />
                    <Button type="submit" size="icon" className="rounded-xl shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-2">
                <UserPlus className="w-12 h-12 opacity-20" />
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
