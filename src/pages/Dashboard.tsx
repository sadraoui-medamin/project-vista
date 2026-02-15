import { useState } from "react";
import { motion } from "framer-motion";
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
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: KanbanSquare, label: "Projects" },
  { icon: Clock, label: "Time Tracking" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Settings" },
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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`glass border-r border-border flex flex-col ${
          collapsed ? "w-16" : "w-60"
        } transition-all duration-300 shrink-0`}
      >
        <div className="p-4 flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5 shrink-0">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-foreground truncate">ProjectFlow</span>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.active
                  ? "gradient-bg text-primary-foreground gradient-shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="glass border-b border-border px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
              />
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, projects..."
                className="glass border-0 rounded-xl h-9 pl-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full gradient-bg" />
            </button>
            <div className="gradient-bg rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, <span className="gradient-text">{user?.name || "User"}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats */}
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
              {/* Projects */}
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
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.progress}% complete</span>
                      <span>{project.tasks} tasks</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Recent Tasks</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    View All
                  </Button>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                  <div className="divide-y divide-border">
                    {recentTasks.map((task) => (
                      <div
                        key={task.title}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {task.title}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                            statusColors[task.status]
                          }`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 hidden sm:inline ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                        <div className="gradient-bg rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                          {task.assignee}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
