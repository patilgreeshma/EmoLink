import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hello! I'm here to listen. How are you feeling today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            const { data } = await api.post('/ai-chat', {
                message: userMessage.text
            });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error("I'm having trouble connecting right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[380px] shadow-2xl"
                    >
                        <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 overflow-hidden">
                            <CardHeader className="bg-primary/10 p-4 flex flex-row items-center justify-between space-y-0 sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/20 p-1.5 rounded-full">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold text-foreground">Support Companion</CardTitle>
                                        <p className="text-xs text-muted-foreground">Always here for you</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={toggleChat}>
                                        <Minimize2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={toggleChat}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                                    <div className="flex flex-col gap-4 min-h-full">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex gap-2 max-w-[85%]",
                                                    msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
                                                )}
                                            >
                                                <Avatar className="w-8 h-8 shrink-0">
                                                    {msg.sender === 'user' ? (
                                                        <>
                                                            <AvatarImage src="" />
                                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                                <User className="w-4 h-4" />
                                                            </AvatarFallback>
                                                        </>
                                                    ) : (
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            <Bot className="w-4 h-4" />
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>

                                                <div
                                                    className={cn(
                                                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                                        msg.sender === 'user'
                                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                                            : "bg-muted text-foreground rounded-tl-none"
                                                    )}
                                                >
                                                    {msg.text}
                                                    <div className={cn(
                                                        "text-[10px] mt-1 opacity-70 flex justify-end",
                                                        msg.sender === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {isLoading && (
                                            <div className="flex gap-2 self-start max-w-[85%]">
                                                <Avatar className="w-8 h-8 shrink-0">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        <Bot className="w-4 h-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="p-3 bg-muted/20 border-t border-border">
                                <div className="flex w-full items-center gap-2">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Type a message..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-background border-input focus-visible:ring-primary rounded-full px-4"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim() || isLoading}
                                        className="rounded-full h-10 w-10 shrink-0 shadow-sm"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                onClick={toggleChat}
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-105",
                    isOpen ? "bg-muted text-muted-foreground hover:bg-muted/80 rotate-90 scale-0 opacity-0 absolute" : "scale-100 opacity-100"
                )}
            >
                <MessageCircle className="w-7 h-7" />
            </Button>
        </div>
    );
};

export default FloatingChatbot;
