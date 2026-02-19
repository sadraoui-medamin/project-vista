import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MoreHorizontal, Users, Calendar, Search, Filter,
  ChevronDown, ChevronUp, X, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: number;
  members: number;
  due: string;
  color: string;
  status: string;
  priority: string;
  createdAt: string;
  tags: string[];
}

const initialProjects: Project[] = [
  { id: "1", name: "Website Redesign", description: "Complete overhaul of the company website with new branding, improved UX, and mobile-first approach.", progress: 72, tasks: 24, members: 5, due: "Mar 15", color: "from-primary to-accent", status: "Active", priority: "High", createdAt: "Jan 10, 2026", tags: ["Design", "Frontend"] },
  { id: "2", name: "Mobile App v2", description: "Second major release of the mobile application with offline support, push notifications, and redesigned navigation.", progress: 45, tasks: 38, members: 8, due: "Apr 1", color: "from-accent to-primary", status: "Active", priority: "Critical", createdAt: "Dec 5, 2025", tags: ["Mobile", "React Native"] },
  { id: "3", name: "API Integration", description: "Integrate third-party APIs for payment processing, analytics, and CRM synchronization.", progress: 89, tasks: 12, members: 3, due: "Feb 28", color: "from-primary to-primary", status: "Active", priority: "Medium", createdAt: "Jan 20, 2026", tags: ["Backend", "API"] },
  { id: "4", name: "Design System", description: "Build a comprehensive design system with reusable components, tokens, and documentation.", progress: 100, tasks: 16, members: 4, due: "Feb 10", color: "from-accent to-accent", status: "Completed", priority: "Medium", createdAt: "Nov 1, 2025", tags: ["Design", "Documentation"] },
  { id: "5", name: "Customer Portal", description: "Self-service portal for customers to manage accounts, view invoices, and submit support tickets.", progress: 15, tasks: 42, members: 6, due: "May 20", color: "from-primary to-accent", status: "Planning", priority: "High", createdAt: "Feb 1, 2026", tags: ["Frontend", "Backend"] },
  { id: "6", name: "Data Pipeline", description: "ETL pipeline for real-time data processing, warehousing, and business intelligence dashboards.", progress: 60, tasks: 20, members: 3, due: "Mar 30", color: "from-accent to-primary", status: "Active", priority: "Low", createdAt: "Jan 15, 2026", tags: ["Backend", "Data"] },
];

const statusColors: Record<string, string> = {
  Active: "bg-accent/20 text-accent",
  Completed: "bg-green-500/20 text-green-500",
  Planning: "bg-primary/20 text-primary",
};

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/20 text-destructive",
  High: "bg-orange-500/20 text-orange-500",
  Medium: "bg-primary/20 text-primary",
  Low: "bg-muted text-muted-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  Active: <Clock className="h-4 w-4 text-accent" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Planning: <AlertCircle className="h-4 w-4 text-primary" />,
};

const colorOptions = [
  { label: "Blue → Cyan", value: "from-primary to-accent" },
  { label: "Cyan → Blue", value: "from-accent to-primary" },
  { label: "Blue", value: "from-primary to-primary" },
  { label: "Cyan", value: "from-accent to-accent" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // New project form
  const [form, setForm] = useState({ name: "", description: "", status: "Planning", priority: "Medium", due: "", members: "1", color: "from-primary to-accent" });

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      progress: 0,
      tasks: 0,
      members: parseInt(form.members) || 1,
      due: form.due || "TBD",
      color: form.color,
      status: form.status,
      priority: form.priority,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tags: [],
    };
    setProjects([newProject, ...projects]);
    setForm({ name: "", description: "", status: "Planning", priority: "Medium", due: "", members: "1", color: "from-primary to-accent" });
    setCreateOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all your team projects</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or tags..."
            className="glass border-0 rounded-xl pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="glass border-0 rounded-xl w-full sm:w-40 h-10">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Project grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => {
            const expanded = expandedId === project.id;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass rounded-2xl p-6 hover:gradient-shadow transition-shadow duration-300 group cursor-pointer ${expanded ? "md:col-span-2 xl:col-span-3" : ""}`}
                onClick={() => setExpandedId(expanded ? null : project.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:gradient-text transition-all">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-4">{project.progress}% complete · {project.tasks} tasks</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.members} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due {project.due}</span>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <div className="flex items-center gap-1.5">
                              {statusIcons[project.status]}
                              <span className="text-sm font-medium text-foreground">{project.status}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Priority</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${priorityColors[project.priority]}`}>{project.priority}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="text-sm font-medium text-foreground">{project.createdAt}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Due Date</p>
                            <p className="text-sm font-medium text-foreground">{project.due}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-1">Description</p>
                          <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
                        </div>

                        {project.tags.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((tag) => (
                                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          <div className="glass rounded-xl p-3 text-center">
                            <p className="text-lg font-bold gradient-text">{project.tasks}</p>
                            <p className="text-xs text-muted-foreground">Total Tasks</p>
                          </div>
                          <div className="glass rounded-xl p-3 text-center">
                            <p className="text-lg font-bold gradient-text">{Math.round(project.tasks * project.progress / 100)}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                          <div className="glass rounded-xl p-3 text-center">
                            <p className="text-lg font-bold gradient-text">{project.members}</p>
                            <p className="text-xs text-muted-foreground">Members</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No projects match your search.</p>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="glass border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Project</DialogTitle>
            <DialogDescription>Fill in the details to create a new project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name *</Label>
              <Input
                placeholder="e.g. Website Redesign"
                className="glass border-0 rounded-xl"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief project description..."
                className="glass border-0 rounded-xl resize-none"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  placeholder="e.g. Apr 15"
                  className="glass border-0 rounded-xl"
                  value={form.due}
                  onChange={(e) => setForm({ ...form, due: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Members</Label>
                <Input
                  type="number"
                  min={1}
                  className="glass border-0 rounded-xl"
                  value={form.members}
                  onChange={(e) => setForm({ ...form, members: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
                <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name.trim()} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
