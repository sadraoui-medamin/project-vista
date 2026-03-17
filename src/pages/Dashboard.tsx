import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, KanbanSquare, Clock, BarChart3, Settings, Users, Bell,
  Search, Plus, LogOut, Zap, ChevronRight, ChevronDown, MoreHorizontal,
  ArrowUpCircle, Lock, HelpCircle, User, Palette, ArrowRightLeft, X,
  ExternalLink, FileText, BookOpen, GraduationCap, MessageCircle,
  AlertTriangle, MessageSquare, Keyboard, Smartphone, Sparkles, CheckCircle2,
  TrendingUp, Activity, Calendar, Target, FolderPlus, ListChecks, UserPlus,
  Timer, Monitor, CreditCard, Key, Eye, Shield, Trash2, Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateSampleTasks, SHARED_MEMBERS, TEMPLATES, type Workspace } from "@/types/workspace";

import ProjectsPage from "@/pages/dashboard/ProjectsPage";
import TimeTrackingPage from "@/pages/dashboard/TimeTrackingPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import TeamPage from "@/pages/dashboard/TeamPage";
import AccountSettingsPage from "@/pages/dashboard/AccountSettingsPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import WorkspaceSettingsPage from "@/pages/dashboard/WorkspaceSettingsPage";
import PersonalSettingsPage from "@/pages/dashboard/PersonalSettingsPage";
import UserManagementPage from "@/pages/dashboard/UserManagementPage";
import LicensingPage from "@/pages/dashboard/LicensingPage";
import { DashboardStatsCharts } from "@/components/dashboard/DashboardStatsCharts";
import type { Plan } from "@/contexts/AuthContext";

const pageAccess: Record<string, Plan> = {
  dashboard: "free", projects: "free", team: "free", time: "pro", analytics: "pro",
  accountSettings: "free", billing: "free", workspaceSettings: "free",
  personalSettings: "free", userManagement: "free", licensing: "free",
};
const featureLabels: Record<string, string> = { time: "Time Tracking", analytics: "Analytics" };
const planRank: Record<Plan, number> = { free: 0, pro: 1, enterprise: 2 };

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Q1 Sprint Board", description: "Main development sprint for Q1 2026", template: "scrum", members: SHARED_MEMBERS.slice(0, 5), tasks: generateSampleTasks("scrum"), createdAt: "Jan 10, 2026", color: "from-accent to-primary" },
  { id: "2", name: "Product Roadmap", description: "High-level project tracking for all teams", template: "kanban", members: SHARED_MEMBERS.slice(0, 6), tasks: generateSampleTasks("kanban"), createdAt: "Dec 5, 2025", color: "from-primary to-accent" },
  { id: "3", name: "Bug Triage", description: "Track and resolve all reported bugs", template: "bug-tracking", members: SHARED_MEMBERS.slice(2, 7), tasks: generateSampleTasks("bug-tracking"), createdAt: "Feb 1, 2026", color: "from-destructive to-primary" },
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
  "In Progress": "bg-accent/20 text-accent", "In Review": "bg-primary/20 text-primary",
  Done: "bg-green-500/20 text-green-500", "To Do": "bg-muted text-muted-foreground",
};
const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/20 text-destructive", High: "bg-orange-500/20 text-orange-500",
  Medium: "bg-primary/20 text-primary", Low: "bg-muted text-muted-foreground",
};

const notifications = [
  { id: 1, title: "New task assigned to you", desc: "Fix checkout flow bug", time: "2 min ago", unread: true, icon: ListChecks },
  { id: 2, title: "Maria completed a task", desc: "Design system tokens", time: "15 min ago", unread: true, icon: CheckCircle2 },
  { id: 3, title: "Sprint review tomorrow", desc: "Q1 Sprint Board - 10:00 AM", time: "1 hour ago", unread: false, icon: Calendar },
  { id: 4, title: "New team member joined", desc: "Alex Kim joined your workspace", time: "3 hours ago", unread: false, icon: UserPlus },
  { id: 5, title: "Deployment succeeded", desc: "API Integration v2.1.0", time: "5 hours ago", unread: false, icon: Sparkles },
];

const helpLinks = [
  { icon: Sparkles, label: "Find out what's changed", external: true },
  { icon: BookOpen, label: "Read about the new navigation", external: true },
  { icon: FileText, label: "Browse complete documentation", external: true },
  { icon: GraduationCap, label: "Build skills with Learning", external: true },
  { icon: MessageCircle, label: "Ask our Community forums", external: true },
  { icon: AlertTriangle, label: "Contact support", external: true },
];
const helpActions = [
  { icon: MessageSquare, label: "Give feedback about ProjectFlow", highlight: true },
  { icon: Keyboard, label: "Keyboard shortcuts", highlight: false },
  { icon: Smartphone, label: "Get ProjectFlow Mobile", external: true },
];

function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="fixed top-14 right-28 z-50 w-[320px] glass-strong rounded-xl shadow-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Help</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div className="py-2">
        {helpLinks.map((link) => (
          <button key={link.label} className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
            <link.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-left">{link.label}</span>
            {link.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        ))}
      </div>
      <div className="border-t border-border py-2">
        {helpActions.map((action) => (
          <button key={action.label} className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-colors ${action.highlight ? "text-primary hover:bg-primary/5" : "text-foreground hover:bg-muted/50"}`}>
            <action.icon className={`h-4 w-4 shrink-0 ${action.highlight ? "text-primary" : "text-muted-foreground"}`} />
            <span className="flex-1 text-left">{action.label}</span>
            {"external" in action && action.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <a href="#" className="hover:text-primary">About ProjectFlow</a>
        <a href="#" className="hover:text-primary">Terms of use</a>
        <a href="#" className="hover:text-primary">Privacy policy</a>
      </div>
    </motion.div>
  );
}

function DashboardHome({ user, onNavigate }: { user: { name: string; email: string } | null; onNavigate: (page: string) => void }) {
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
          { label: "Active Tasks", value: "24", change: "+3 today", icon: ListChecks, color: "text-primary" },
          { label: "Completed", value: "156", change: "+12 this week", icon: CheckCircle2, color: "text-green-500" },
          { label: "In Review", value: "8", change: "2 urgent", icon: Timer, color: "text-orange-500" },
          { label: "Team Online", value: "6/9", change: "3 away", icon: Users, color: "text-accent" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "New Project", icon: FolderPlus, action: () => onNavigate("projects") },
            { label: "Create Task", icon: Plus, action: () => onNavigate("projects") },
            { label: "Invite Member", icon: UserPlus, action: () => onNavigate("team") },
            { label: "View Reports", icon: BarChart3, action: () => onNavigate("analytics") },
          ].map((qa) => (
            <button key={qa.label} onClick={qa.action} className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:gradient-shadow transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <qa.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tasks Due Today", value: "5", icon: Target, bg: "bg-destructive/10", color: "text-destructive" },
          { label: "Weekly Velocity", value: "32", icon: TrendingUp, bg: "bg-primary/10", color: "text-primary" },
          { label: "Open PRs", value: "4", icon: Activity, bg: "bg-accent/10", color: "text-accent" },
          { label: "Upcoming Meetings", value: "2", icon: Calendar, bg: "bg-primary/10", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className={`glass rounded-2xl p-4 border-l-4 ${stat.bg.replace("/10", "/30")}`}>
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <DashboardStatsCharts />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Projects</h2>
            <Button size="sm" onClick={() => onNavigate("projects")} className="gradient-bg text-primary-foreground border-0 rounded-xl h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" /> New
            </Button>
          </div>
          {projects.map((project) => (
            <div key={project.name} className="glass rounded-2xl p-4 hover:gradient-shadow transition-shadow duration-300 cursor-pointer" onClick={() => onNavigate("projects")}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-foreground">{project.name}</h3>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full bg-gradient-to-r ${project.color}`} style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{project.progress}% complete</span><span>{project.tasks} tasks</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Tasks</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => onNavigate("projects")}>View All</Button>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {recentTasks.map((task) => (
                <div key={task.title} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{task.title}</p></div>
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
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const accountOptions = useMemo<Array<{ id: string; name: string; email: string; plan: Plan }>>(
    () => [
      { id: "current", name: user?.name || "User", email: user?.email || "user@example.com", plan: user?.plan || "free" },
      { id: "studio", name: "Maya Chen", email: "maya@projectflow.app", plan: "pro" },
      { id: "ops", name: "Noah Parker", email: "noah@projectflow.app", plan: "enterprise" },
    ],
    [user],
  );
  const [activeAccountId, setActiveAccountId] = useState("current");
  const activeAccount = accountOptions.find((account) => account.id === activeAccountId) ?? accountOptions[0];
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [upgradeDialog, setUpgradeDialog] = useState<string | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<number[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [directWorkspaceId, setDirectWorkspaceId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);

  const handleSignOut = () => { signOut(); navigate("/"); };
  const userPlan = activeAccount.plan || "free";
  const hasAccess = (page: string) => {
    const required = pageAccess[page] || "free";
    return planRank[userPlan] >= planRank[required];
  };
  const markAllRead = () => setReadNotifs(notifications.map((n) => n.id));
  const unreadCount = notifications.filter((n) => n.unread && !readNotifs.includes(n.id)).length;

  const handleCreateWorkspace = useCallback((ws: Workspace) => {
    setWorkspaces((prev) => [ws, ...prev]);
  }, []);

  const handleUpdateWorkspace = useCallback((updated: Workspace) => {
    setWorkspaces((prev) => prev.map((w) => w.id === updated.id ? updated : w));
  }, []);

  const handleDeleteWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    setDeleteTarget(null);
  }, []);

  const openWorkspaceDirectly = (wsId: string) => {
    setDirectWorkspaceId(wsId);
    setActivePage("projects");
  };

  const renderPage = () => {
    switch (activePage) {
      case "projects":
        return (
          <ProjectsPage
            workspaces={workspaces}
            onCreate={handleCreateWorkspace}
            onUpdate={handleUpdateWorkspace}
            onDelete={(ws) => setDeleteTarget(ws)}
            initialWorkspaceId={directWorkspaceId}
            onClearDirect={() => setDirectWorkspaceId(null)}
          />
        );
      case "time": return <TimeTrackingPage />;
      case "analytics": return <AnalyticsPage />;
      case "team": return <TeamPage />;
      case "accountSettings": return <AccountSettingsPage />;
      case "billing": return <BillingPage />;
      case "workspaceSettings": return <WorkspaceSettingsPage />;
      case "personalSettings": return <PersonalSettingsPage />;
      case "userManagement": return <UserManagementPage />;
      case "licensing": return <LicensingPage />;
      default: return <DashboardHome user={activeAccount} onNavigate={setActivePage} />;
    }
  };

  const sidebarNav = [
    { icon: Clock, label: "Time Tracking", key: "time" },
    { icon: BarChart3, label: "Analytics", key: "analytics" },
    { icon: Users, label: "Team", key: "team" },
  ];

  const getInitials = (name: string) => name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
  const userInitials = getInitials(activeAccount.name || "User");

  const recentWorkspaces = workspaces.slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex">
      <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className={`glass border-r border-border flex flex-col ${collapsed ? "w-16" : "w-60"} transition-all duration-300 shrink-0`}>
        <div className="p-4 flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5 shrink-0"><Zap className="h-4 w-4 text-primary-foreground" /></div>
          {!collapsed && <span className="font-bold text-foreground truncate">ProjectFlow</span>}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <button onClick={() => { setActivePage("dashboard"); setDirectWorkspaceId(null); }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${activePage === "dashboard" ? "gradient-bg text-primary-foreground gradient-shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </button>

          {/* Manage Projects - expandable */}
          <div>
            <button onClick={() => { if (collapsed) { setActivePage("projects"); setDirectWorkspaceId(null); } else setProjectsExpanded(!projectsExpanded); }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${activePage === "projects" ? "gradient-bg text-primary-foreground gradient-shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <KanbanSquare className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Manage Projects</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${projectsExpanded ? "" : "-rotate-90"}`} />
                </>
              )}
            </button>

            {!collapsed && (
              <AnimatePresence>
                {projectsExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                      {recentWorkspaces.map((ws) => {
                        const tpl = TEMPLATES.find((t) => t.key === ws.template);
                        return (
                          <div key={ws.id} className="flex items-center group">
                            <button onClick={() => openWorkspaceDirectly(ws.id)}
                              className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all truncate">
                              <span className="text-sm">{tpl?.icon || "📋"}</span>
                              <span className="truncate">{ws.name}</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(ws); }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all shrink-0">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                      <button onClick={() => { setActivePage("projects"); setDirectWorkspaceId(null); }}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-primary hover:bg-muted/50 transition-all font-medium">
                        <Plus className="h-3 w-3" /><span>New Project</span>
                      </button>
                      <button onClick={() => { setActivePage("projects"); setDirectWorkspaceId(null); }}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                        <Settings className="h-3 w-3" /><span>My Workspaces</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {sidebarNav.map((item) => {
            const locked = !hasAccess(item.key);
            return (
              <button key={item.key} onClick={() => locked ? setUpgradeDialog(item.key) : setActivePage(item.key)}
                className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${activePage === item.key && !locked ? "gradient-bg text-primary-foreground gradient-shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {locked && !collapsed && <span className="ml-auto bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center shrink-0"><Lock className="h-3 w-3 text-black" /></span>}
                {locked && collapsed && <span className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center"><Lock className="h-2.5 w-2.5 text-black" /></span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4 shrink-0" />{!collapsed && <span>Sign Out</span>}
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
            {userPlan === "free" && (
              <Button size="sm" className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl h-8 text-xs gap-1.5" onClick={() => setActivePage("billing")}>
                <ArrowUpCircle className="h-3.5 w-3.5" /> Upgrade
              </Button>
            )}
            {userPlan !== "free" && <span className="text-xs font-semibold gradient-text uppercase">{userPlan}</span>}

            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <button className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-bg text-[9px] font-bold text-primary-foreground flex items-center justify-center">{unreadCount}</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[360px] p-0 glass border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-[320px] overflow-auto divide-y divide-border">
                  {notifications.map((n) => {
                    const isUnread = n.unread && !readNotifs.includes(n.id);
                    return (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer ${isUnread ? "bg-primary/5" : ""}`}
                        onClick={() => setReadNotifs((prev) => [...new Set([...prev, n.id])])}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUnread ? "bg-primary/10" : "bg-muted"}`}>
                          <n.icon className={`h-4 w-4 ${isUnread ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm ${isUnread ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                        {isUnread && <div className="w-2 h-2 rounded-full gradient-bg shrink-0 mt-2" />}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border px-4 py-2.5">
                  <button className="w-full text-xs text-primary hover:underline text-center font-medium">View all notifications</button>
                </div>
              </PopoverContent>
            </Popover>

            <button onClick={() => setHelpOpen(!helpOpen)} className={`text-muted-foreground hover:text-foreground transition-colors ${helpOpen ? "text-primary" : ""}`}>
              <HelpCircle className="h-5 w-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] glass border-border rounded-xl p-0 overflow-hidden">
                <div className="px-4 py-3"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ProjectFlow Settings</p></div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActivePage("workspaceSettings")} className="gap-3 px-4 py-3 cursor-pointer">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div><p className="text-sm font-medium">Workspace settings</p><p className="text-xs text-muted-foreground">Manage workspace name, domains, user groups and time zone</p></div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("personalSettings")} className="gap-3 px-4 py-3 cursor-pointer">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div><p className="text-sm font-medium">Personal settings</p><p className="text-xs text-muted-foreground">Manage notification preferences and themes</p></div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-4 py-2"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin settings</p></div>
                <DropdownMenuItem onClick={() => setActivePage("userManagement")} className="gap-3 px-4 py-3 cursor-pointer">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1"><p className="text-sm font-medium">User management</p><p className="text-xs text-muted-foreground">Manage users, groups, and access requests</p></div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("licensing")} className="gap-3 px-4 py-3 cursor-pointer">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1"><p className="text-sm font-medium">Licensing</p><p className="text-xs text-muted-foreground">Server and Data Center licensing</p></div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("billing")} className="gap-3 px-4 py-3 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1"><p className="text-sm font-medium">Billing</p><p className="text-xs text-muted-foreground">Update your billing details, manage subscriptions</p></div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="gradient-bg rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity">{userInitials}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 glass border-border rounded-xl p-0 overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <div className="gradient-bg rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">{userInitials}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{activeAccount.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activeAccount.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActivePage("accountSettings")} className="gap-3 px-4 py-2.5 cursor-pointer"><User className="h-4 w-4" /> Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("accountSettings")} className="gap-3 px-4 py-2.5 cursor-pointer"><Eye className="h-4 w-4" /> Visibility & Privacy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage("accountSettings")} className="gap-3 px-4 py-2.5 cursor-pointer"><Shield className="h-4 w-4" /> Password & Security</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-3 px-4 py-2.5 cursor-pointer"><Palette className="h-4 w-4" /> Theme</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass border-border rounded-xl min-w-52">
                    {[
                      { key: "system", label: "Browser default" },
                      { key: "dark", label: "Dark" },
                      { key: "light", label: "Light" },
                    ].map((option) => (
                      <DropdownMenuItem key={option.key} onClick={() => setTheme(option.key)} className="cursor-pointer text-sm flex items-center justify-between gap-3">
                        <span>{option.label}</span>
                        {theme === option.key && <Check className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-3 px-4 py-2.5 cursor-pointer"><ArrowRightLeft className="h-4 w-4" /> Switch account</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass border-border rounded-xl min-w-64">
                    {accountOptions.map((account) => (
                      <DropdownMenuItem key={account.id} onClick={() => setActiveAccountId(account.id)} className="cursor-pointer gap-3 px-3 py-2.5">
                        <div className="gradient-bg rounded-full w-8 h-8 flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">{getInitials(account.name)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{account.email}</p>
                        </div>
                        {activeAccountId === account.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-3 px-4 py-2.5 cursor-pointer text-destructive focus:text-destructive"><LogOut className="h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{renderPage()}</main>
      </div>

      <AnimatePresence>{helpOpen && <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />}</AnimatePresence>

      {/* Delete workspace confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-sm">
          <DialogHeader className="text-center items-center">
            <div className="bg-destructive/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">Delete Workspace</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span>? This action cannot be undone and all tasks will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDeleteWorkspace(deleteTarget.id)} className="flex-1 rounded-xl">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade dialog */}
      <Dialog open={!!upgradeDialog} onOpenChange={(open) => !open && setUpgradeDialog(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-sm">
          <DialogHeader className="text-center items-center">
            <div className="gradient-bg rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2"><Lock className="h-6 w-6 text-primary-foreground" /></div>
            <DialogTitle className="text-lg font-bold text-foreground">{featureLabels[upgradeDialog || ""] || upgradeDialog} is locked</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Upgrade to the <span className="font-semibold gradient-text capitalize">{pageAccess[upgradeDialog || ""] || "pro"}</span> plan to unlock this feature.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setUpgradeDialog(null); setActivePage("billing"); }} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-6 gap-2 w-full">
            <ArrowUpCircle className="h-4 w-4" /> Upgrade Now
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
