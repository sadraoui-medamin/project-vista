import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Plus, Hash, Lock, Phone, Video, MoreHorizontal,
  Smile, Paperclip, AtSign, Pin, Users, Star, ChevronDown,
  Circle, MessageSquare, Image, FileText, Mic,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "dm";
  unread: number;
  pinned?: boolean;
  members?: string[];
  lastMessage?: string;
  avatar?: string;
}

interface Message {
  id: string;
  sender: string;
  initials: string;
  content: string;
  time: string;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  thread?: number;
  isSystem?: boolean;
}

const channels: Channel[] = [
  { id: "general", name: "general", type: "public", unread: 3, pinned: true },
  { id: "engineering", name: "engineering", type: "public", unread: 0, pinned: true },
  { id: "design", name: "design", type: "public", unread: 1 },
  { id: "product", name: "product", type: "public", unread: 0 },
  { id: "random", name: "random", type: "public", unread: 5 },
  { id: "private-core", name: "core-team", type: "private", unread: 0 },
  { id: "private-leads", name: "team-leads", type: "private", unread: 2 },
];

const directMessages: Channel[] = [
  { id: "dm-1", name: "Alex Kim", type: "dm", unread: 1, members: ["online"], lastMessage: "Sounds good! I'll review the PR" },
  { id: "dm-2", name: "Maria Johnson", type: "dm", unread: 0, members: ["online"], lastMessage: "The mockups are ready" },
  { id: "dm-3", name: "Sam Rivera", type: "dm", unread: 0, members: ["away"], lastMessage: "Let me check that" },
  { id: "dm-4", name: "Priya Lakshmi", type: "dm", unread: 3, members: ["offline"], lastMessage: "Can we sync later?" },
  { id: "dm-5", name: "Jordan Chen", type: "dm", unread: 0, members: ["online"], lastMessage: "Done ✅" },
];

const messagesByChannel: Record<string, Message[]> = {
  general: [
    { id: "1", sender: "Alex Kim", initials: "AK", content: "Good morning team! 🌅 Sprint retrospective is at 2pm today.", time: "9:02 AM", reactions: [{ emoji: "👋", count: 4, reacted: false }, { emoji: "👍", count: 2, reacted: true }] },
    { id: "s1", sender: "", initials: "", content: "Maria Johnson joined the channel", time: "9:15 AM", isSystem: true },
    { id: "2", sender: "Maria Johnson", initials: "MJ", content: "Morning! I've pushed the new design tokens to the repo. Can everyone pull and check if the colors look right on their end?", time: "9:18 AM", thread: 3 },
    { id: "3", sender: "Sam Rivera", initials: "SR", content: "Pulled and checked — looks great on my end. The new accent color is 🔥", time: "9:24 AM", reactions: [{ emoji: "🔥", count: 3, reacted: false }] },
    { id: "4", sender: "Priya Lakshmi", initials: "PL", content: "Same here, no issues. @Maria the contrast ratio on the secondary buttons might need a tweak for accessibility though.", time: "9:31 AM" },
    { id: "5", sender: "Alex Kim", initials: "AK", content: "Good catch Priya. Maria, can you run the axe audit on those? Also, reminder: PRs need to be up by EOD for the release.", time: "9:45 AM", reactions: [{ emoji: "✅", count: 2, reacted: false }] },
    { id: "6", sender: "Jordan Chen", initials: "JC", content: "I'll handle the API rate limiting PR. Should have it ready by noon.", time: "10:02 AM" },
    { id: "7", sender: "Maria Johnson", initials: "MJ", content: "On it! Running the audit now. Will share results in #design 🎨", time: "10:15 AM", reactions: [{ emoji: "🎨", count: 1, reacted: false }] },
  ],
  engineering: [
    { id: "e1", sender: "Jordan Chen", initials: "JC", content: "Deployed v2.1.0 to staging. All tests passing ✅", time: "8:45 AM", reactions: [{ emoji: "🚀", count: 5, reacted: true }] },
    { id: "e2", sender: "Sam Rivera", initials: "SR", content: "Nice! I noticed the cold start times improved by 40% with the new bundling config.", time: "8:52 AM" },
    { id: "e3", sender: "Alex Kim", initials: "AK", content: "Great work everyone. Let's monitor the error rates for the next hour before promoting to prod.", time: "9:00 AM", thread: 2 },
  ],
  design: [
    { id: "d1", sender: "Maria Johnson", initials: "MJ", content: "New component library is live in Figma. Link: https://figma.com/...", time: "Yesterday, 4:30 PM" },
    { id: "d2", sender: "Priya Lakshmi", initials: "PL", content: "Love the new icon set! Are we going with rounded or sharp corners?", time: "Yesterday, 4:45 PM" },
    { id: "d3", sender: "Maria Johnson", initials: "MJ", content: "Rounded for sure — fits our brand language better. Here's the comparison:", time: "Yesterday, 5:00 PM" },
  ],
};

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-muted-foreground/40",
};

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState<Record<string, Message[]>>(messagesByChannel);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelSearch, setChannelSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const allChannels = [...channels, ...directMessages];
  const current = allChannels.find((c) => c.id === activeChannel);
  const currentMessages = messages[activeChannel] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChannel, currentMessages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      initials: "YO",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInput("");
  };

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );
  const filteredDMs = directMessages.filter((c) =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  const pinnedChannels = filteredChannels.filter((c) => c.pinned);
  const unpinnedChannels = filteredChannels.filter((c) => !c.pinned);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-4rem)] -mt-2 -mx-2 rounded-2xl overflow-hidden border border-border bg-background">
      {/* Channel sidebar */}
      <div className="w-64 border-r border-border flex flex-col bg-muted/30 shrink-0">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-background border-border rounded-lg"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Pinned */}
            {pinnedChannels.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
                {pinnedChannels.map((ch) => (
                  <ChannelItem key={ch.id} channel={ch} active={activeChannel === ch.id} onClick={() => setActiveChannel(ch.id)} />
                ))}
              </div>
            )}

            {/* Channels */}
            <div className="mb-3">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Channels</span>
                <button className="text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {unpinnedChannels.map((ch) => (
                <ChannelItem key={ch.id} channel={ch} active={activeChannel === ch.id} onClick={() => setActiveChannel(ch.id)} />
              ))}
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
                <button className="text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {filteredDMs.map((dm) => (
                <DMItem key={dm.id} channel={dm} active={activeChannel === dm.id} onClick={() => setActiveChannel(dm.id)} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 min-w-0">
            {current?.type === "dm" ? (
              <>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                    {current.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{current.name}</h2>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Circle className={`h-2 w-2 fill-current ${statusColors[current.members?.[0] || "offline"]} rounded-full`} />
                    {current.members?.[0] || "offline"}
                  </span>
                </div>
              </>
            ) : (
              <>
                {current?.type === "private" ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Hash className="h-4 w-4 text-muted-foreground" />}
                <h2 className="text-sm font-semibold text-foreground">{current?.name}</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Phone className="h-4 w-4" /></button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Video className="h-4 w-4" /></button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Pin className="h-4 w-4" /></button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Users className="h-4 w-4" /></button>
            <div className="relative ml-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-40 pl-7 text-xs bg-muted/50 border-0 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-1">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            )}
            {currentMessages.map((msg, i) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted-foreground">{msg.content}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }
              const showAvatar = i === 0 || currentMessages[i - 1]?.sender !== msg.sender || currentMessages[i - 1]?.isSystem;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`group flex gap-3 px-2 py-1 rounded-lg hover:bg-muted/30 transition-colors ${showAvatar ? "mt-3" : "mt-0"}`}
                >
                  <div className="w-8 shrink-0">
                    {showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                          {msg.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{msg.sender}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>
                    )}
                    <p className="text-sm text-foreground/90 leading-relaxed">{msg.content}</p>
                    {msg.reactions && (
                      <div className="flex gap-1.5 mt-1.5">
                        {msg.reactions.map((r) => (
                          <button
                            key={r.emoji}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                              r.reacted
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {r.emoji} {r.count}
                          </button>
                        ))}
                        <button className="px-1.5 py-0.5 rounded-full text-xs border border-transparent text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                          <Smile className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {msg.thread && (
                      <button className="flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline">
                        <MessageSquare className="h-3 w-3" />
                        {msg.thread} replies
                      </button>
                    )}
                  </div>
                  {/* Hover actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-0.5 pt-1">
                    <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><Smile className="h-3.5 w-3.5" /></button>
                    <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><MessageSquare className="h-3.5 w-3.5" /></button>
                    <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><Pin className="h-3.5 w-3.5" /></button>
                    <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-3 border-t border-border bg-background/80">
          <div className="flex items-end gap-2 glass rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-colors">
            <div className="flex gap-0.5 pb-1">
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Message ${current?.type === "dm" ? current.name : "#" + (current?.name || "")}`}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none py-1"
              />
            </div>
            <div className="flex gap-0.5 pb-1">
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Paperclip className="h-4 w-4" /></button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Smile className="h-4 w-4" /></button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><AtSign className="h-4 w-4" /></button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"><Mic className="h-4 w-4" /></button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> Format</button>
            <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"><Image className="h-3 w-3" /> Media</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChannelItem({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-all ${
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {channel.type === "private" ? <Lock className="h-3.5 w-3.5 shrink-0" /> : <Hash className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate flex-1 text-left">{channel.name}</span>
      {channel.unread > 0 && (
        <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {channel.unread}
        </span>
      )}
    </button>
  );
}

function DMItem({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) {
  const status = channel.members?.[0] || "offline";
  const initials = channel.name.split(" ").map((n) => n[0]).join("");
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-all ${
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${statusColors[status]}`} />
      </div>
      <span className="truncate flex-1 text-left">{channel.name}</span>
      {channel.unread > 0 && (
        <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {channel.unread}
        </span>
      )}
    </button>
  );
}
