import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  KanbanSquare,
  Clock,
  BarChart3,
  Settings,
  Users,
  Bell,
  Search,
  Plus,
  LogOut,
  Zap,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  ArrowUpCircle,
  Lock,
  HelpCircle,
  User,
  Palette,
  ArrowRightLeft,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import ProjectsPage from "@/pages/dashboard/ProjectsPage";
import TimeTrackingPage from "@/pages/dashboard/TimeTrackingPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import TeamPage from "@/pages/dashboard/TeamPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import type { Plan } from "@/contexts/AuthContext";
import { TEMPLATES } from "@/types/workspace";

// Define which plan is required for each page
const pageAccess: Record<string, Plan> = {
  dashboard: "free",
  projects: "free",
  team: "free",
  time: "pro",
  analytics: "pro",
  settings: "free",
};

const featureLabels: Record<string, string> = {
  time: "Time Tracking",
  analytics: "Analytics",
};

const planRank: Record<Plan, number> = { free: 0, pro: 1, enterprise: 2 };

const recentWorkspaces = [
  { id: "1", name: "Q1 Sprint Board", icon: "🏃" },
  { id: "2", name: "Product Roadmap", icon: "📋" },
  { id: "3", name: "Bug Triage", icon: "🐛" },
];

const projects = [
  { name: "Website Redesign", progress: 72, tasks: 24, color: "from-primary to-accent" },
  { name: "Mobile App v2", progress: 45, tasks: 38, color: "from-accent to-primary" },
  { name: "API Integration", progress: 89, tasks: 12, color: "from-primary to-primary" },
];

const recentTasks = [
  { title: "Update landing page hero", status: "In Progress", priority: "High", assignee: "AK" },
  { title: "Fix checkout flow bug", status: "In Review", priority: "Critical", assignee: "MJ" },
  { title: "Design system tokens", status: "Done", priority: "Medium", assignee: "SR" },
  { title: "API rate limiting", status: "To Do", priority: "High", assignee: "PL" },
  { title: "User onboarding flow", status: "In Progress", priority: "Medium", assignee: "AK" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-accent/20 text-accent",
  "In Review": "bg-primary/20 text-primary",
  Done: "bg-green-500/20 text-green-500",
  "To Do": "bg-muted text-muted-foreground",
};

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/20 text-destructive",
  High: "bg-orange-500/20 text-orange-500",
  Medium: "bg-primary/20 text-primary",
  Low: "bg-muted text-muted-foreground",
};

const helpSuggestions = [
  "How do I create a workspace?",
  "How do I manage team permissions?",
  "What are the different project templates?",
];

function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi, welcome to ProjectFlow Support.\n\nYou can get help with any of our features in this AI-powered chat.\n\nHow can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Thanks for your question! Our team will get back to you shortly. In the meantime, check our documentation for quick answers." },
      ]);
    }, 800);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 w-[380px] h-[520px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5">
            <HelpCircle className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Help</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "gradient-bg text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <div className="flex flex-col items-center gap-2 mt-4">
            {helpSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask a question to get started"
            className="glass border-0 rounded-xl text-sm h-9"
          />
          <Button
            size="icon"
            onClick={() => handleSend(input)}
            className="gradient-bg text-primary-foreground border-0 rounded-xl h-9 w-9 shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">ⓘ Uses AI. Verify results</p>
      </div>
    </motion.div>
  );
}

function DashboardHome({ user }: { user: { name: string; email: string } | null }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{user?.name || "User"}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Tasks", value: "24", change: "+3 today" },
          { label: "Completed", value: "156", change: "+12 this week" },
          { label: "In Review", value: "8", change: "2 urgent" },
          { label: "Team Online", value: "6/9", change: "3 away" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold gradient-text mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Projects</h2>
            <Button size="sm" className="gradient-bg text-primary-foreground border-0 rounded-xl h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" /> New
            </Button>
          </div>
          {projects.map((project) => (
            <div key={project.name} className="glass rounded-2xl p-4 hover:gradient-shadow transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-foreground">{project.name}</h3>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full bg-gradient-to-r ${project.color}`} style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{project.progress}% complete</span>
                <span>{project.tasks} tasks</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Tasks</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View All</Button>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {recentTasks.map((task) => (
                <div key={task.title} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusColors[task.status]}`}>{task.status}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 hidden sm:inline ${priorityColors[task.priority]}`}>{task.priority}</span>
                  <div className="gradient-bg rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">{task.assignee}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [upgradeDialog, setUpgradeDialog] = useState<string | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const userPlan = user?.plan || "free";

  const hasAccess = (page: string) => {
    const required = pageAccess[page] || "free";
    return planRank[userPlan] >= planRank[required];
  };

  const renderPage = () => {
    switch (activePage) {
      case "projects": return <ProjectsPage />;
      case "time": return <TimeTrackingPage />;
      case "analytics": return <AnalyticsPage />;
      case "team": return <TeamPage />;
      case "settings": return <SettingsPage />;
      default: return <DashboardHome user={user} />;
    }
  };

  const sidebarNav = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: Clock, label: "Time Tracking", key: "time" },
    { icon: BarChart3, label: "Analytics", key: "analytics" },
    { icon: Users, label: "Team", key: "team" },
    { icon: Settings, label: "Settings", key: "settings" },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background flex">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`glass border-r border-border flex flex-col ${collapsed ? "w-16" : "w-60"} transition-all duration-300 shrink-0`}
      >
        <div className="p-4 flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5 shrink-0"><Zap className="h-4 w-4 text-primary-foreground" /></div>
          {!collapsed && <span className="font-bold text-foreground truncate">ProjectFlow</span>}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActivePage("dashboard")}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
              activePage === "dashboard"
                ? "gradient-bg text-primary-foreground gradient-shadow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </button>

          {/* Projects - expandable */}
          <div>
            <button
              onClick={() => {
                if (collapsed) {
                  setActivePage("projects");
                } else {
                  setProjectsExpanded(!projectsExpanded);
                }
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                activePage === "projects"
                  ? "gradient-bg text-primary-foreground gradient-shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <KanbanSquare className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Projects</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${projectsExpanded ? "" : "-rotate-90"}`} />
                </>
              )}
            </button>

            {/* Sub-items: recent workspaces */}
            {!collapsed && (
              <AnimatePresence>
                {projectsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                      {recentWorkspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => setActivePage("projects")}
                          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all truncate"
                        >
                          <span className="text-sm">{ws.icon}</span>
                          <span className="truncate">{ws.name}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setActivePage("projects")}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-primary hover:bg-muted/50 transition-all font-medium"
                      >
                        <Plus className="h-3 w-3" />
                        <span>View all</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Rest of nav items */}
          {sidebarNav.slice(1).map((item) => {
            const locked = !hasAccess(item.key);
            return (
              <button
                key={item.key}
                onClick={() => locked ? setUpgradeDialog(item.key) : setActivePage(item.key)}
                className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activePage === item.key && !locked
                    ? "gradient-bg text-primary-foreground gradient-shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {locked && !collapsed && (
                  <span className="ml-auto bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    <Lock className="h-3 w-3 text-black" />
                  </span>
                )}
                {locked && collapsed && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center">
                    <Lock className="h-2.5 w-2.5 text-black" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass border-b border-border px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground shrink-0">
              <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks, projects..." className="glass border-0 rounded-xl h-9 pl-9 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.plan === "free" && (
              <Button
                size="sm"
                className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl h-8 text-xs gap-1.5"
                onClick={() => setActivePage("settings")}
              >
                <ArrowUpCircle className="h-3.5 w-3.5" />
                Upgrade
              </Button>
            )}
            {user?.plan && user.plan !== "free" && (
              <span className="text-xs font-semibold gradient-text uppercase">{user.plan}</span>
            )}
            <ThemeToggle />
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full gradient-bg" />
            </button>

            {/* Help button */}
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className={`text-muted-foreground hover:text-foreground transition-colors ${helpOpen ? "text-primary" : ""}`}
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="gradient-bg rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity">
                  {userInitials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 glass border-border rounded-xl p-0 overflow-hidden">
                {/* User info header */}
                <div className="p-4 flex items-center gap-3">
                  <div className="gradient-bg rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActivePage("settings")} className="gap-3 px-4 py-2.5 cursor-pointer">
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("settings")} className="gap-3 px-4 py-2.5 cursor-pointer">
                  <Settings className="h-4 w-4" /> Account settings
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-3 px-4 py-2.5 cursor-pointer">
                    <Palette className="h-4 w-4" /> Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass border-border rounded-xl">
                    <DropdownMenuItem className="cursor-pointer text-sm">Light</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-sm">Dark</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-sm">System</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer">
                  <ArrowRightLeft className="h-4 w-4" /> Switch account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="gap-3 px-4 py-2.5 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>

      {/* Help panel */}
      <AnimatePresence>
        {helpOpen && <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />}
      </AnimatePresence>

      <Dialog open={!!upgradeDialog} onOpenChange={(open) => !open && setUpgradeDialog(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-sm">
          <DialogHeader className="text-center items-center">
            <div className="gradient-bg rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              {featureLabels[upgradeDialog || ""] || upgradeDialog} is locked
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Upgrade to the <span className="font-semibold gradient-text capitalize">{pageAccess[upgradeDialog || ""] || "pro"}</span> plan to unlock this feature.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => { setUpgradeDialog(null); setActivePage("settings"); }}
            className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-6 gap-2 w-full"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
