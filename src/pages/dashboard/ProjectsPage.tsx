import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, X, Users, Calendar, LayoutGrid, List, SlidersHorizontal,
  ArrowUpDown, CheckCircle2, Clock, TrendingUp, FolderKanban, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TEMPLATES, type Workspace } from "@/types/workspace";
import CreateWorkspaceModal from "@/components/dashboard/workspace/CreateWorkspaceModal";
import WorkspaceView from "@/components/dashboard/workspace/WorkspaceView";

interface Props {
  workspaces: Workspace[];
  onCreate: (workspace: Workspace) => void;
  onUpdate: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
  initialWorkspaceId?: string | null;
  onClearDirect?: () => void;
}

type ViewMode = "grid" | "list";
type SortKey = "name" | "createdAt" | "progress" | "tasks";
type FilterTemplate = "all" | string;

export default function ProjectsPage({ workspaces, onCreate, onUpdate, onDelete, initialWorkspaceId, onClearDirect }: Props) {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [filterTemplate, setFilterTemplate] = useState<FilterTemplate>("all");

  // If navigated directly to a workspace
  useEffect(() => {
    if (initialWorkspaceId) {
      setActiveWorkspaceId(initialWorkspaceId);
      onClearDirect?.();
    }
  }, [initialWorkspaceId, onClearDirect]);

  const getProgress = (ws: Workspace) => {
    const columns = [...new Set(ws.tasks.map((t) => t.status))];
    const done = columns[columns.length - 1];
    return ws.tasks.length > 0 ? Math.round((ws.tasks.filter((t) => t.status === done).length / ws.tasks.length) * 100) : 0;
  };

  const filtered = workspaces
    .filter((w) =>
      (w.name.toLowerCase().includes(search.toLowerCase()) || w.template.toLowerCase().includes(search.toLowerCase())) &&
      (filterTemplate === "all" || w.template === filterTemplate)
    )
    .sort((a, b) => {
      switch (sortKey) {
        case "name": return a.name.localeCompare(b.name);
        case "tasks": return b.tasks.length - a.tasks.length;
        case "progress": return getProgress(b) - getProgress(a);
        default: return 0;
      }
    });

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const totalTasks = workspaces.reduce((sum, w) => sum + w.tasks.length, 0);
  const totalCompleted = workspaces.reduce((sum, w) => {
    const cols = [...new Set(w.tasks.map((t) => t.status))];
    const done = cols[cols.length - 1];
    return sum + w.tasks.filter((t) => t.status === done).length;
  }, 0);
  const avgProgress = workspaces.length > 0 ? Math.round(workspaces.reduce((s, w) => s + getProgress(w), 0) / workspaces.length) : 0;

  if (activeWorkspace) {
    return (
      <WorkspaceView
        workspace={activeWorkspace}
        onBack={() => setActiveWorkspaceId(null)}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, organize, and manage your team workspaces</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Projects", value: workspaces.length, icon: FolderKanban, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Tasks", value: totalTasks, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Completed", value: totalCompleted, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search workspaces..." className="glass border-0 rounded-xl pl-9 h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 border-border">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {filterTemplate === "all" ? "All Templates" : TEMPLATES.find((t) => t.key === filterTemplate)?.name || "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-border rounded-xl">
            <DropdownMenuItem onClick={() => setFilterTemplate("all")} className="cursor-pointer text-sm">All Templates</DropdownMenuItem>
            {TEMPLATES.map((t) => (
              <DropdownMenuItem key={t.key} onClick={() => setFilterTemplate(t.key)} className="cursor-pointer text-sm gap-2"><span>{t.icon}</span> {t.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 border-border"><ArrowUpDown className="h-3.5 w-3.5" /> Sort</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-border rounded-xl">
            <DropdownMenuItem onClick={() => setSortKey("name")} className="cursor-pointer text-sm">Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortKey("tasks")} className="cursor-pointer text-sm">Most Tasks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortKey("progress")} className="cursor-pointer text-sm">Progress</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center glass rounded-xl overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setViewMode("list")} className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} workspace{filtered.length !== 1 ? "s" : ""}</p>

      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((ws) => {
              const tpl = TEMPLATES.find((t) => t.key === ws.template);
              const progress = getProgress(ws);
              return (
                <motion.div key={ws.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-2xl p-6 hover:gradient-shadow transition-shadow duration-300 cursor-pointer group relative">
                  <button onClick={(e) => { e.stopPropagation(); onDelete(ws); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div onClick={() => setActiveWorkspaceId(ws.id)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tpl?.icon}</span>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:gradient-text transition-all">{ws.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{tpl?.name}</span>
                        </div>
                      </div>
                    </div>
                    {ws.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ws.description}</p>}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div className={`h-full rounded-full bg-gradient-to-r ${ws.color} transition-all duration-500`} style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{progress}% · {ws.tasks.length} tasks</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>{ws.members.length} members</span></div>
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>{ws.createdAt}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                      {tpl?.tabs.map((tab) => <span key={tab.key} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tab.label}</span>)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {viewMode === "list" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_80px_100px_40px] gap-4 px-4 py-2.5 border-b border-border text-[10px] font-medium text-muted-foreground uppercase">
            <span>Workspace</span><span>Template</span><span>Tasks</span><span>Progress</span><span>Members</span><span></span>
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.map((ws) => {
              const tpl = TEMPLATES.find((t) => t.key === ws.template);
              const progress = getProgress(ws);
              return (
                <motion.div key={ws.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-[1fr_100px_100px_80px_100px_40px] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0" onClick={() => setActiveWorkspaceId(ws.id)}>
                    <span className="text-lg">{tpl?.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ws.name}</p>
                      {ws.description && <p className="text-xs text-muted-foreground truncate">{ws.description}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{tpl?.name}</span>
                  <span className="text-xs text-muted-foreground">{ws.tasks.length}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${ws.color}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{progress}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> {ws.members.length}</div>
                  <button onClick={() => onDelete(ws)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {filtered.length === 0 && <div className="text-center py-16"><p className="text-muted-foreground">No workspaces found.</p></div>}

      <CreateWorkspaceModal open={createOpen} onOpenChange={setCreateOpen} onCreate={onCreate} />
    </motion.div>
  );
}
